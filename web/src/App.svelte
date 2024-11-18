<script lang="ts">
  import { token } from "$lib/store/token.svelte";
  import Home from "$routes/Home.svelte";
  import Login from "$routes/Login.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  const queryClient = new QueryClient();
</script>

<div>
  <QueryClientProvider client={queryClient}>
    {#if token.value !== null && token.value.length > 0}
      <Home />
    {:else}
      <Login />
    {/if}
  </QueryClientProvider>
</div>
