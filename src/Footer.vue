<template>
  <footer>
    <div class="buttons">
      <button class="orange button">
        <span class="left-icon"><i class="fa fa-lg fa-crosshairs"></i></span>
        <span>Detect</span>
      </button>
      <button class="blue button">
        <span class="left-icon"><i class="fa fa-lg fa-sitemap"></i></span>
        <span>Classify</span>
      </button>
      <button class="green button">
        <span class="left-icon"><i class="fa fa-lg fa-check"></i></span>
        <span>Approve</span>
      </button>
    </div>
  </footer>
</template>

<script>
  export default {}
</script>

<style lang="scss" scoped>
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 11px 11px;
    background-color: #313131;
  }

  .button {
    background-clip: padding-box;      /* all hail transparent borders */
    font-weight: 500;
    width: 150px;
    height: 45px;
    /*border: 0px solid #b61d22;*/
    border-radius: 2px;
    color: #fff;
    /*background-color: #272727;*/
    background-color: #1d1d1d;
    transition: color 100ms ease-in-out, background-color 400ms ease-in-out, border-color 100ms ease-in-out;
  }

  .button:hover {
    background-color: #f0f0f0;
  }

  .button:active {
    background-color: #fff;
  }

  .button:hover.green {
    color: #fff;
    background-color: #27ae60;
    border-color: #27ae60;
  }

  .button:active.green {
    color: #fff;
    background-color: #2ecc71;
    border-color: #2ecc71;
  }

  .button:hover.blue {
    color: #fff;
    background-color: #22A7F0;
    border-color: #22A7F0;
  }

  .button:active.blue {
    color: #fff;
    background-color: #19B5FE;
    border-color: #19B5FE;
  }

  .button:hover.orange {
    color: #fff;
    background-color: #f39c12;
    border-color: #f39c12;
  }

  .button:active.orange {
    color: #fff;
    background-color: #ffa812;
    border-color: #ffa812;
  }

  /* One of the finest things I learnt from semantic-ui*/
  .buttons.button {
    margin-left: 1px;
    margin-right: 1px;
  }

  .buttons.button:first-child {
    margin-left: 0px;
    margin-right: 1px;
  }

  .buttons.button:last-child {
    margin-left: 1px;
    margin-right: 0px;
  }

  .left-icon {
    padding-right: 5px;
  }

  .right-icon {
    padding-left: 5px;
  }

</style>
