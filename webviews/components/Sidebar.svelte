<script lang="ts">
    import { onMount } from "svelte";
    import { Jellyfish } from 'svelte-loading-spinners';
    import Highlight from "svelte-highlight";
    import tokyo from "svelte-highlight/styles/tokyo-night-dark";
    import python from "svelte-highlight/languages/python";
    import type { CodeSelectionInfo, OutputMessage } from "../globals";
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
                    const code_explanation_info: OutputMessage = JSON.parse(message.value)
                    code_explanation = String(code_explanation_info.explanation);
                    // code_explanation = code_explanation.replaceAll("\\n", "<br />");
                    if(code_explanation_info.pullRequestUrl !== ""){
                        code_explanation += `\n\nFor more information, please visit this <a href=${code_explanation_info.pullRequestUrl}>PR link</a>`;
                    } else {
                        code_explanation += "\n\nUnfortunately, I could not find the relevant PR Information for the selected code."
                    }
                    break;
            }
        });
    })
</script>

<svelte:head>
  {@html tokyo}
</svelte:head>

<style>
    .ce {
        white-space: pre-line;
    }
</style>

<h2>Selected Code</h2>
<Highlight language={python} {code} />

<h2>Code Explanation</h2>
<div>
    <div class="ce">
        { @html code_explanation}
    </div>
    {#if loading}
        <h3>Analyzing Git Information</h3>
        <Jellyfish size="60" color="#2d4ceb" unit="px" duration="2s" />
    {/if}
</div>