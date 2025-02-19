<script setup lang="ts">
import { ACTIVITY_STATUS_CANCELLED, ACTIVITY_STATUS_SUCCESSFUL, ACTIVITY_STATUS_UNSUCCESSFUL } from "@toruslabs/base-controllers";
import { SolanaTransactionActivity } from "@toruslabs/solana-controllers";
import dateFormat from "dateformat";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import SolanaLogoDark from "@/assets/solana-logo-shaded.png";
import SolanaLogoLight from "@/assets/solana-logo-shaded-light.png";
import { ActivityPageInteractions, trackUserClick } from "@/directives/google-analytics";
import ControllerModule from "@/modules/controllers";

const props = defineProps<{
  activity: SolanaTransactionActivity;
}>();

// const selectedNetworkDisplayName = computed(() => ControllerModule.selectedNetworkDisplayName);
// const showDetails = ref(false);

const { t } = useI18n();

const openExplorerLink = (link: string) => {
  trackUserClick(ActivityPageInteractions.ACTIVITY_DETAIL + link);
  window.open(link, "_blank");
};
const toggleDetails = (link: string) => {
  // showDetails.value = !showDetails.value;
  openExplorerLink(link);
};
const getTxStatusColor = (status: string): string => {
  if (status === ACTIVITY_STATUS_SUCCESSFUL) return "#9BE8C7";
  if (status === ACTIVITY_STATUS_UNSUCCESSFUL || status === ACTIVITY_STATUS_CANCELLED) return "#FEA29F";
  return "#E0E0E0";
};

const amountIsVisible = computed(() => {
  return props.activity.type === "transfer" || props.activity.type === "transferChecked";
});
</script>
<template>
  <div
    class="w-full bg-white dark:bg-app-gray-700 border border-app-gray-400 dark:border-transparent shadow dark:shadow-dark rounded-md p-4 grid grid-cols-12 gap-2 cursor-pointer"
    @keydown="toggleDetails(activity.blockExplorerUrl)"
    @click="toggleDetails(activity.blockExplorerUrl)"
  >
    <!-- date -->
    <div class="col-span-8 order-3 pl-9 flex items-center justify-start sm:order-1 sm:col-span-2 sm:border-r sm:pl-0 xl:col-span-1">
      <div class="text-xxs text-app-text-400 dark:text-app-text-dark-600 lt-md:ml-3">
        {{ dateFormat(new Date(activity.updatedAt || 0), "dS mmm, yyyy") }}
        <br />
        at {{ dateFormat(new Date(activity.updatedAt || 0), "H:MM:ss") }}
      </div>
    </div>
    <!-- logo + text -->
    <div
      class="col-span-8 order-1 pl-0 sm:order-2 sm:pl-6 sm:col-span-6 xl:col-span-7"
      :class="{ 'col-span-12 sm:col-span-6 xl:col-span-7': !amountIsVisible }"
    >
      <div class="flex items-center">
        <div class="logo-container">
          <img
            class="block h-7 w-auto"
            :src="activity.logoURI || (ControllerModule.isDarkMode ? SolanaLogoLight : SolanaLogoDark)"
            :class="activity.logoURI ? '' : 'rounded-full'"
            alt="Solana Logo"
          />
        </div>
        <div class="text-left ml-4 break-words overflow-hidden">
          <div v-if="activity.type === 'unknown'" class="text-xs font-medium text-app-text-600 dark:text-app-text-dark-600">
            {{ t("walletActivity.unknown") }}
          </div>
          <div v-if="activity.type === 'transfer' || activity.type === 'transferChecked'">
            <div class="text-xs font-medium text-app-text-600 dark:text-app-text-dark-600">
              {{ activity.send ? t("walletActivity.sent") : t("walletActivity.received") }} {{ " " }} {{ Number(activity.totalAmountString) }}
              {{ activity.cryptoCurrency }}

              <span v-if="activity.cryptoCurrency === 'SOL'" class="text-xxs text-app-text-400 dark:text-app-text-dark-600"
                >{{ activity.send ? t("walletActivity.to") : t("walletActivity.from") }} {{ " " }}</span
              >
            </div>
            <div v-if="activity.cryptoCurrency === 'SOL'" class="text-xs text-app-text-400 dark:text-app-text-dark-600 break-words">
              {{ activity.send ? activity.to : activity.from }}
            </div>
          </div>
          <div
            v-if="!(activity.type === 'transfer' || activity.type === 'transferChecked')"
            class="text-xxs text-app-text-400 dark:text-app-text-dark-600 break-all"
          >
            {{ activity.signature }}
          </div>
        </div>
      </div>
    </div>
    <!-- Amount -->
    <div
      v-if="amountIsVisible"
      class="col-span-4 order-2 text-right sm:col-span-2 sm:order-3 sm:text-left sm:flex sm:items-center xl:col-span-2 pl-4"
    >
      <div>
        <div class="text-xs font-medium text-app-text-600 dark:text-app-text-dark-500">
          {{ Number(activity.totalAmountString) }}
        </div>
        <div class="text-xxs text-app-text-400 dark:text-app-text-dark-600">
          {{ activity.cryptoCurrency }}
        </div>
      </div>
    </div>
    <!-- status -->
    <div class="col-span-4 text-right order-4 flex items-center justify-end sm:col-span-2" :class="{ 'sm:col-span-4': !amountIsVisible }">
      <div class="rounded-xl inline-block bg-green-300 text-xs text-center py-1 px-5" :style="{ backgroundColor: getTxStatusColor(activity.status) }">
        {{ t(`walletActivity.${activity.status}`) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  min-width: 32px;
}
</style>
