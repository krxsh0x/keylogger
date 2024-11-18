<script>
  const items = Array.from({ length: 3 });
  import { Laptop, ChevronDown } from "lucide-svelte";
  import Skeleton from "./Skeleton.svelte";
</script>

{#each items as _, i}
  <div class="bg-zinc-900 shadow-md rounded-lg p-5 flex items-center">
    <div class="flex-shrink-0 mr-4">
      <Laptop class="w-8 h-8 text-gray-300" />
    </div>

    <div class="flex-grow">
      <Skeleton className="h-6 w-32 mb-2">
        <span></span>
      </Skeleton>
    </div>

    <div class="flex items-center space-x-2 ml-auto mr-4">
      <Skeleton className="w-20 h-5">
        <span></span>
      </Skeleton>
      <Skeleton className="w-20 h-5">
        <span></span>
      </Skeleton>
    </div>

    <div class="flex-shrink-0">
      <Skeleton className="w-5 h-5">
        <ChevronDown class="w-5 h-5 text-gray-300" />
      </Skeleton>
    </div>
  </div>
{/each}
