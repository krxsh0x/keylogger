<script lang="ts">
  import { token } from "$lib/store/token.svelte";
  import { BASE_URL } from "$utils/conts";
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (form) {
      const accessToken = (form.elements.namedItem("token") as HTMLInputElement)
        .value;
      const data = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken,
        }),
      }).then((res) => res.json());
      if (data) {
        if (data.status === "success") {
          token.set(accessToken);
        } else {
          alert(data.message);
        }
      }
    }
  };
</script>

<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2
      class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
      Login to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-4" action="#" on:submit|preventDefault={handleSubmit}>
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-white">
          Access token
        </label>
        <div class="mt-1">
          <input
            id="token"
            name="Access token"
            required
            placeholder="Enter access token"
            class="block bg-zinc-950 w-full rounded-md border-0 px-1.5 py-1.5 ring-1 ring-inset ring-zinc-800 focus:outline-none text-gray-400 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 text-sm" />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-700 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
          Login
        </button>
      </div>
    </form>
  </div>
</div>
