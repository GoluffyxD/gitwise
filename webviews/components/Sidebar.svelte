<script lang="ts">
    import { onMount } from "svelte";
    import { Jellyfish } from 'svelte-loading-spinners';
    import Highlight from "svelte-highlight";
    import tokyo from "svelte-highlight/styles/tokyo-night-dark";
    import python from "svelte-highlight/languages/python";
    import type { CodeSelectionInfo } from "../globals";
    let language = "py";
    let selectedCode = "";
    let code_selection: CodeSelectionInfo;
    let code_explanation: string = "";
    let code = "";
    let loading: boolean = false;
    onMount(()=> {
        // Handle messages sent from the extension to the webview
        window.addEventListener('message', event => {
            const message = event.data; // The json data that the extension sent
            console.log("Received message")
            switch (message.type) {
                case 'code-select':
                    // code_selection = message.info;
                    const code_selection_info: CodeSelectionInfo = JSON.parse(message.value);
                    selectedCode = code_selection_info.code_selected;
                    code = selectedCode;
                    code_selection = code_selection_info;
                    code_explanation = ""; // Reset the explanation once code is selected.
                    loading = true;
                    break;
                case 'code-explain':
                    // code_selection = message.info;
                    loading = false;
                    code_explanation = message.value;
                    break;
            }
        });
    })
</script>

<svelte:head>
  {@html tokyo}
</svelte:head>

<style>
</style>

<h2>Selected Code</h2>
<Highlight language={python} {code} />

<h2>Code Explanation</h2>
<div>
    {code_explanation}
    {#if loading}
        <h3>Analyzing Git Information</h3>
        <Jellyfish size="60" color="#2d4ceb" unit="px" duration="2s" />
    {/if}
</div>