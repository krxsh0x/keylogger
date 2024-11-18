<script>
  import { token } from "$lib/store/token.svelte";
  import { BASE_URL } from "$utils/conts";
  import { fetcher } from "$utils/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import LogData from "./LogData.svelte";
  import { slide } from "svelte/transition";

  let { id } = $props();
  const accessToken = token.value;
  const query = createQuery({
    queryKey: ["device-logs", id],
    queryFn: () => fetcher(`${BASE_URL}/api/logs/${id}`, accessToken),
  });
</script>

<div transition:slide={{ duration: 300 }}>
  {#if $query.isLoading}
    <p>Loading ...</p>
  {:else if $query.isError}
    <p>Error</p>
  {:else if $query.isSuccess}
    {#each $query.data as log}
      <LogData {...log} />
    {/each}
  {/if}
</div>
