<script lang="ts">
  import { formatDate } from "$utils/utils";
  import { Calendar, Clipboard, Image, Keyboard } from "lucide-svelte";
  let { screenshot, timestamp, raw, clipboard, data } = $props();
  function formatRawInput(raw: string) {
    const keyRegex = /Key\.[a-zA-Z0-9_]+/g;
    return raw.replace(keyRegex, (match) => {
      const keyName = match.replace("Key.", "");
      return `<kbd class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">${keyName}</kbd>`;
    });
  }
</script>

<div class="bg-zinc-900 rounded-lg p-4 mt-4 shadow">
  <div class="mb-2">
    <div class="flex items-center space-x-2 text-sm font-medium text-white">
      <Calendar class="w-4 h-4" />
      <span>{formatDate(timestamp)}</span>
    </div>
  </div>
  <div class="space-y-2">
    <div class="flex items-start space-x-2">
      <Keyboard class="w-4 h-4 mt-1 text-white" />
      <p class="text-sm text-white">{@html formatRawInput(raw)}</p>
    </div>
    <div class="flex items-start space-x-2">
      <Clipboard class="w-4 h-4 mt-1 text-white" />
      <p class="text-sm text-white">Clipboard: {clipboard}</p>
    </div>
    {#if data.emails.length > 0 || data.passwords.length > 0 || data.phone_numbers.length > 0}
      <div class="bg-gray-100 p-2 rounded-md">
        {#if data.emails.length > 0}
          <div class="text-sm font-medium text-gray-800">Emails</div>
          <ul class="list-disc list-inside">
            {#each data.emails as email}
              <span
                class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
                >{email}</span>
            {/each}
          </ul>
        {/if}
        {#if data.passwords.length > 0}
          <div class="text-sm font-medium text-gray-800">Passwords</div>
          <ul class="list-disc list-inside">
            {#each data.passwords as password}
              <span
                class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full"
                >{password}</span>
            {/each}
          </ul>
        {/if}
        {#if data.phone_numbers.length > 0}
          <div class="text-sm font-medium text-gray-800">Phone numbers</div>
          <ul class="list-disc list-inside">
            {#each data.phone_numbers as phone_number}
              <span
                class="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full"
                >{phone_number}</span>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
    <div>
      <p class="text-sm font-medium mb-1 flex items-center">
        <Image class="w-4 h-4 mr-1" /> Screenshot
      </p>
      <img
        src={screenshot}
        alt={`Screenshot from ${formatDate(timestamp)}`}
        class="w-full h-auto rounded-md shadow-sm"
        loading="lazy" />
    </div>
  </div>
</div>
