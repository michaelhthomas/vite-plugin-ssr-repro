export function renderState(stateObj) {
  return `
    <script id="cognito-ssr_pageContext" type="application/json">
      ${JSON.stringify(stateObj)}
    </script>
  `
}
