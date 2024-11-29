<template>
  <div>
  <header>
    <img src="./assets/logo-website-footer.png" alt="">
    <div class="button-container">
      <button>
        <i class="fa fa-cog"></i>
        <ul>
          <!--<li @click.prevent.stop="emitImport">Import...</li>-->
          <li @click.prevent.stop="emitExport">Export GeoJSON...</li>
        </ul>
      </button>
    </div>
  </header>

</div>
</template>

<script>
  export default {
    methods: {
      emitImport() {
        console.log('emitting importData');
        this.$emit('importData');
      },
      emitExport() {
        console.log('emitting exportData');
        this.$emit('exportData');
      }
    }
  }
</script>

<style lang="scss" scoped>
  ul {
    position: absolute;
    top: 65px;
    right: 10px;
    z-index: 10000;
  }

  li {
    width: 200px;
    padding: 10px 20px;
    color: #fff;
    background-color: #b61d22;
    font-size: 14px;
    display: none;
    box-shadow: 0px 24px 49px 0px rgba(0,0,0,0.48);
    transition: background-color 400ms ease-in-out;
  }

  li:hover {
    background-color: #1d1d1d;
  }

  li:active {
    transition: background-color 0ms ease-in-out;
    background-color: #8f181b;
  }

  li:nth-child(odd) {
    border-bottom: 1px solid #8f181b;
  }

  li:last-child {
    border-bottom: 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 65px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #313131;
  }

  img {
    height: 42px;
  }

  .button-container {
    background-color: #b61d22;
    transition: background-color 400ms ease-in-out;
  }

  .button-container:hover {
    background-color: #1d1d1d;
  }

  button {
    width: 42px;
    height: 70px;
    font-size: 30px;
    color: #313131;
    background-color: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    transition: color 400ms ease-in-out;
    i {
      transition: transform 300ms ease-in-out;
    }
  }

  button:hover {
    color: #b61d22;
  }

  button:focus {
    i {
      transform: rotate(90deg);
    }
    li {
      display: block;
      animation: fadeIn 300ms ease-in-out forwards;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media screen and (max-width: 768px) {
    header {
      padding-right: 0;
    }

    ul {
      right: 0;
    }

    li {
      width: 200px;
      padding: 10px 20px;
      color: #fff;
      background-color: #1d1d1d;
      font-size: 14px;
      display: none;
      transition: background-color 400ms ease-in-out;
    }

    li:hover {
      background-color: #b61d22;
    }

    li:active {
      transition: background-color 0ms ease-in-out;
      background-color: #8f181b;
    }

    .button-container {
      background-color: #1d1d1d;
    }

    .button-container:hover {
      background-color: #b61d22;
    }

    button {
      width: 42px;
      height: 70px;
      font-size: 30px;
      color: #b61d22;
      background-color: transparent;
      border: 0;
      padding: 0;
      margin: 0;
      transition: color 400ms ease-in-out;
      i {
        transition: transform 300ms ease-in-out;
      }
    }

    button:hover {
      color: #313131;
    }

    button:focus {
      i {
        transform: rotate(90deg);
      }
    }
  }
</style>
