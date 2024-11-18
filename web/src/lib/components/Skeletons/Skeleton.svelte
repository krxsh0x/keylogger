<script lang="ts">
  import { cn } from "$utils/utils";
  let { className, children } = $props();
</script>

<div class={cn("animate-pulse rounded-md bg-zinc-200/10", className)}>
  {@render children?.()}
</div>
