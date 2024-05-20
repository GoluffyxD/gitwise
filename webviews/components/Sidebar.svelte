<script lang="ts">
    import { onMount } from "svelte";
    import Prism from 'prismjs';
    let language = "py";
    let selectedCode = "";
    let code = "";
    onMount(()=> {
        // Prism.highlightAll();
        // Handle messages sent from the extension to the webview
        window.addEventListener('message', event => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case 'code-select':
                    selectedCode = message.value;
                    console.log(selectedCode);
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