<script setup lang="ts">
import { BROADCAST_CHANNELS, BroadcastChannelHandler, broadcastChannelOptions, POPUP_RESULT } from "@toruslabs/base-controllers";
import { BroadcastChannel } from "@toruslabs/broadcast-channel";
import log from "loglevel";
import { onMounted, reactive } from "vue";

import Permissions from "@/components/permissions/Permissions.vue";
import { SignMessageChannelDataType } from "@/utils/enums";

import ControllerModule from "../modules/controllers";
import { redirectToResult, useRedirectFlow } from "../utils/redirectflow_helpers";

const { isRedirectFlow, params, method, resolveRoute, jsonrpc, req_id } = useRedirectFlow();

const channel = `${BROADCAST_CHANNELS.TRANSACTION_CHANNEL}_${new URLSearchParams(window.location.search).get("instanceId")}`;

interface MsgData {
  origin: string;
  data?: Uint8Array;
  message: string;
}
const msg_data = reactive<MsgData>({
  origin: "",
  message: "",
});

onMounted(async () => {
  if (Object.keys(params).length) params.message = Uint8Array.from(Object.values(params?.message));
  let channel_msg: Partial<SignMessageChannelDataType>;
  try {
    if (!isRedirectFlow) {
      const bcHandler = new BroadcastChannelHandler(BROADCAST_CHANNELS.TRANSACTION_CHANNEL);
      channel_msg = await bcHandler.getMessageFromChannel<SignMessageChannelDataType>();
    } else if (params?.message)
      channel_msg = {
        data: Buffer.from(params?.message || []).toString("hex"),
        message: Buffer.from(params?.message || []).toString(),
        origin: window.location.origin,
      };
    else {
      redirectToResult(jsonrpc, { message: "Invalid or Missing Params", success: false, method }, req_id, resolveRoute);
      return;
    }

    // TODO: add support to sign array of messages
    msg_data.data = Buffer.from(channel_msg.data as string, "hex");
    msg_data.message = (channel_msg.message as string) || "";
    msg_data.origin = channel_msg.origin as string;
  } catch (error) {
    log.error(error, "error in tx");
  }
});

const approveTxn = async (): Promise<void> => {
  if (!isRedirectFlow) {
    const bc = new BroadcastChannel(channel, broadcastChannelOptions);
    await bc.postMessage({
      data: { type: POPUP_RESULT, approve: true },
    });
    bc.close();
  } else {
    const res = await ControllerModule.torus.signMessage(
      {
        params: {
          data: params.message,
        },
        method: "sign_message",
      },
      true
    );
    redirectToResult(jsonrpc, { data: { signature: Buffer.from(res).toString("hex") }, success: true, method }, req_id, resolveRoute);
  }
};

const closeModal = async () => {
  const bc = new BroadcastChannel(channel, broadcastChannelOptions);
  await bc.postMessage({ data: { type: POPUP_RESULT, approve: false } });
  bc.close();
};

const rejectTxn = async () => {
  if (!isRedirectFlow) {
    closeModal();
  } else {
    redirectToResult(jsonrpc, { success: false, method }, req_id, resolveRoute);
  }
};
</script>

<template>
  <Permissions
    :requested-from="msg_data.origin"
    :approval-message="msg_data.message"
    @on-approved="approveTxn"
    @on-rejected="rejectTxn"
    @on-close-modal="closeModal"
  />
</template>
