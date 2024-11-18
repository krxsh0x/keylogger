<script lang="ts">
  import { BASE_URL } from "$utils/conts";
  import { createQuery } from "@tanstack/svelte-query";
  import { token } from "$lib/store/token.svelte";
  import { fetcher } from "$utils/utils";
  import Devices from "$lib/components/Devices.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import DeviceSkeleton from "$lib/components/Skeletons/DeviceSkeleton.svelte";
  const accessToken = token.value;
  const query = createQuery({
    queryKey: ["home"],
    queryFn: () => fetcher(`${BASE_URL}/api/devices`, accessToken),
  });
</script>

<div>
  <Navbar />
  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="w-full max-w-6xl mx-auto space-y-4">
        {#if $query.isLoading}
          <DeviceSkeleton />
        {:else if $query.isError}
          <p>Error</p>
        {:else if $query.isSuccess}
          {#each $query.data.keys as device}
            <Devices
              id={device.name}
              deviceName={device.metadata.device_name}
              privateIP={device.metadata.IPs.private_ip}
              publicIP={device.metadata.IPs.public_ip} />
          {/each}
        {/if}
      </div>
    </div>
  </main>
</div>
