<script lang="ts">
    import { onMount } from "svelte";
    import Prism from 'prismjs';
    import type { CodeSelectionInfo } from "../globals";
    let language = "py";
    let selectedCode = "";
    let code_selection: CodeSelectionInfo;
    let code_explanation: string = "";
    let code = "";
    onMount(()=> {
        // Prism.highlightAll();
        // Handle messages sent from the extension to the webview
        window.addEventListener('message', event => {
            const message = event.data; // The json data that the extension sent
            console.log("Received message")
            switch (message.type) {
                case 'code-select':
                    // code_selection = message.info;
                    const code_selection_info: CodeSelectionInfo = JSON.parse(message.value);
                    selectedCode = code_selection_info.code_selected;
                    code_selection = code_selection_info;
                    break;
                case 'code-explain':
                    // code_selection = message.info;
                    code_explanation = message.value;
                    break;
            }
        });
    })
</script>

<style>
</style>
  
<div>
    <pre class="line-numbers">
        <code class="language-python">
            {selectedCode}
        </code>
    </pre>
</div>

<div>
    {selectedCode}
</div>

<div>
    {code_selection == undefined ? "" : JSON.stringify(code_selection)}
</div>

<div>
    {code_explanation}
</div>