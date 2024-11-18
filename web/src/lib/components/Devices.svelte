<script>
  import { Laptop, ChevronDown } from "lucide-svelte";
  import DeviceLogs from "./DeviceLogs.svelte";

  let { deviceName, privateIP, publicIP, id } = $props();

  let showDropdown = $state(false);
  let privateTooltip = $state(false);
  let publicTooltip = $state(false);

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }
</script>

<div class="bg-zinc-900 shadow-md rounded-lg p-5 flex items-center">
  <div class="flex-shrink-0 mr-4">
    <Laptop class="w-8 h-8 text-white" />
  </div>

  <div class="flex-grow">
    <h3 class="text-lg font-semibold text-white">{deviceName}</h3>
  </div>

  <div class="flex items-center space-x-2 ml-auto mr-4">
    <div class="relative">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span
        class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-help"
        onmouseenter={() => (privateTooltip = true)}
        onmouseleave={() => (privateTooltip = false)}>
        {privateIP}
      </span>
      {#if privateTooltip}
        <div
          class="absolute z-10 bg-zinc-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
          Private IP
          <svg
            class="absolute text-zinc-800 h-2 w-full left-0 top-full"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xml:space="preserve"
            ><polygon
              class="fill-current"
              points="0,0 127.5,127.5 255,0" /></svg>
        </div>
      {/if}
    </div>

    <div class="relative">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span
        class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-help"
        onmouseenter={() => (publicTooltip = true)}
        onmouseleave={() => (publicTooltip = false)}>
        {publicIP}
      </span>
      {#if publicTooltip}
        <div
          class="absolute z-10 bg-zinc-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
          Public IP
          <svg
            class="absolute text-zinc-800 h-2 w-full left-0 top-full"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xml:space="preserve"
            ><polygon
              class="fill-current"
              points="0,0 127.5,127.5 255,0" /></svg>
        </div>
      {/if}
    </div>
  </div>

  <div class="flex-shrink-0">
    <button
      onclick={toggleDropdown}
      class="text-gray-500 bg-zinc-200/10 rounded-md focus:outline-none"
      aria-label="Toggle dropdown">
      <ChevronDown class="w-5 h-5 {showDropdown ? 'rotate-180' : ''}" />
    </button>
  </div>
</div>

{#if showDropdown}
  <DeviceLogs {id} />
{/if}

<style>
  :global(.rotate-180) {
    transform: rotate(180deg);
    transition: transform 0.2s ease-in-out;
  }
</style>
