<script>
  import { token } from "$lib/store/token.svelte";
</script>

<nav>
  <div class="flex items-center justify-between p-6 px-8">
    <div class="flex items-center space-x-4">
      <a href="/" class="text-white font-bold text-4xl">Keylogger</a>
    </div>
    <button
      on:click={() => token.reset()}
      class="text-white bg-red-500 rounded-md px-3 py-2">Log out</button>
  </div>
</nav>
