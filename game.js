const config = {
    type: Phaser.AUTO,
    width: 1440,
    height: 800,
    parent: "gameContainer",
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: { preload, create, update },
};

const game = new Phaser.Game(config);

let selectedMap = "pista1";
let inMapSelection = false;
let inGallerySelection = false;
let isPlaying = false;
let selectedMenuIndex = 0;
let selectedMapIndex = 0;
let selectedCarIndex = 0;
let carSprite;

const mapImages = ["mapa1", "mapa2", "mapa3"];
const pistaImages = ["pista1", "pista2", "pista3"];
const carImages = ["car1", "car2", "car3", "car4","car5"];

function preload() {
    this.load.image("mapa1", "img/mapa1.png");
    this.load.image("mapa2", "img/mapa2.png");
    this.load.image("mapa3", "img/mapa3.png");
    this.load.image("pista1", "img/pista-mapa1.png");
    this.load.image("pista2", "img/pista-mapa2.png");
    this.load.image("pista3", "img/pista-mapa3.png");

    this.load.image("car1", "img/car1.png");
    this.load.image("car2", "img/car2.png");
    this.load.image("car3", "img/car3.png");
    this.load.image("car4", "img/car4.png");
    this.load.image("car5", "img/car5.png");

    this.load.image("menu1", "img/menu1.png");
    this.load.image("menu2", "img/menu2.png");
    this.load.image("mano", "img/mano.png");
    this.load.image("flecha", "img/arrow.png");
}

function create() {
    const background = this.add.image(0, 0, selectedMap).setOrigin(0, 0);
    background.setDisplaySize(config.width, config.height);

    // Centrar el carrito en la pista
    carSprite = this.add.image(config.width / 2, config.height / 2 + 100, carImages[selectedCarIndex]).setOrigin(0.5);
    carSprite.setVisible(false); // Oculto por defecto, visible en "Play"

    // Div blanco con transparencia
    const menuBackground = this.add.rectangle(720, 450, 380, 520, 0xffffff, 0.8);
    menuBackground.setStrokeStyle(2, 0xcccccc);
    menuBackground.setOrigin(0.5);

    // Encabezado y pie de menú
    const menuHeader = this.add.image(720, 240, "menu1").setOrigin(0.5).setDisplaySize(280, 50);
    const titleText = this.add.text(720, 240, "Juego Carrito", {
      fontSize: "32px",
      fill: "#1E21E5",
      fontFamily: '"Irish Grover", system-ui',
    }).setOrigin(0.5);

    const menuFooter = this.add.image(720, 650, "menu2").setOrigin(0.5).setDisplaySize(280, 50);

    // Opciones de menú
    const buttonStyle = {
      fontSize: "28px",
      color: "#ffffff",
      backgroundColor: "#1E9EE5",
      fontFamily: '"Irish Grover", system-ui',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      align: "center",
      fixedWidth: 200,
      fixedHeight: 50,
      stroke: "#0E0F45",
      strokeThickness: 4,
    };

    const playButton = this.add.text(720, 350, "PLAY", buttonStyle).setOrigin(0.5);
    const galleryButton = this.add.text(720, 420, "GALERIA", buttonStyle).setOrigin(0.5);
    const mapButton = this.add.text(720, 490, "MAPAS", buttonStyle).setOrigin(0.5);
    const creditsButton = this.add.text(720, 560, "CREDITS", buttonStyle).setOrigin(0.5);
    const buttons = [playButton, galleryButton, mapButton, creditsButton];

    const handIcon = this.add.image(600, 350, "mano").setOrigin(0.5);

    function updateHandPosition() {
      if (inMapSelection || inGallerySelection || isPlaying) {
        handIcon.setVisible(false);
      } else {
        handIcon.setVisible(true);
        handIcon.y = buttons[selectedMenuIndex].y;
      }
    }

    // Función para mostrar/ocultar botones del menú
    function toggleMenuButtons(visible) {
      buttons.forEach(button => button.setVisible(visible));
    }

    let previewImage;
    const leftArrow = this.add.image(880, 450, "flecha").setOrigin(0.5).setInteractive().setDisplaySize(50, 50);
    const rightArrow = this.add.image(560, 450, "flecha").setOrigin(0.5).setInteractive().setDisplaySize(50, 50);
    rightArrow.flipX = true;
    leftArrow.setVisible(false);
    rightArrow.setVisible(false);

    function updatePreview() {
      if (inMapSelection) {
        if (previewImage) previewImage.destroy();
        previewImage = this.add.image(720, 450, mapImages[selectedMapIndex]).setOrigin(0.5).setDisplaySize(250, 200);
        leftArrow.setVisible(true);
        rightArrow.setVisible(true);
      } else if (inGallerySelection) {
        if (previewImage) previewImage.destroy();
        previewImage = this.add.image(720, 450, carImages[selectedCarIndex]).setOrigin(0.5).setDisplaySize(250, 200);
        leftArrow.setVisible(true);
        rightArrow.setVisible(true);
      } else {
        if (previewImage) previewImage.destroy();
        leftArrow.setVisible(false);
        rightArrow.setVisible(false);
      }
    }

    function repositionCar() {
        carSprite.setTexture(carImages[selectedCarIndex]);
        carSprite.setPosition(config.width / 2, config.height / 2 + 100); // Centro en la pista
    }

    this.input.keyboard.on("keydown-ENTER", () => {
      if (!inMapSelection && !inGallerySelection && !isPlaying) {
        if (selectedMenuIndex === 2) {
          inMapSelection = true;
          titleText.setText("MAPAS");
          toggleMenuButtons(false);
          updatePreview.call(this);
        } else if (selectedMenuIndex === 1) {
          inGallerySelection = true;
          titleText.setText("GALERIA");
          toggleMenuButtons(false);
          updatePreview.call(this);
        } else if (selectedMenuIndex === 0) { 
          toggleMenuButtons(false);
          menuBackground.setVisible(false);
          menuHeader.setVisible(false);
          menuFooter.setVisible(false);
          titleText.setVisible(false);
          carSprite.setVisible(true);
          isPlaying = true;
          carSprite.setVisible(true);
        }
      } else if (inMapSelection) {
        background.setTexture(pistaImages[selectedMapIndex]);
        inMapSelection = false;
        titleText.setText("Juego Carrito");
        toggleMenuButtons(true);
        updatePreview.call(this);
      } else if (inGallerySelection) {
        repositionCar(); // Reposicionar el carrito seleccionado en el centro
        inGallerySelection = false;
        titleText.setText("Juego Carrito");
        toggleMenuButtons(true);
        updatePreview.call(this);
      }
      updateHandPosition();
    });


    this.input.keyboard.on("keydown-ESC", () => {
        if (isPlaying) {
          isPlaying = false;
          menuBackground.setVisible(true);
          menuHeader.setVisible(true);
          menuFooter.setVisible(true);
          titleText.setVisible(true);
          toggleMenuButtons(true); // Muestra el menú
          carSprite.setVisible(false); // Oculta el carrito
        }
      });

    this.input.keyboard.on("keydown-UP", () => {
      if (!inMapSelection && !inGallerySelection  && !isPlaying) {
        selectedMenuIndex = selectedMenuIndex > 0 ? selectedMenuIndex - 1 : buttons.length - 1;
      } else if (inMapSelection) {
        selectedMapIndex = selectedMapIndex > 0 ? selectedMapIndex - 1 : mapImages.length - 1;
      } else if (inGallerySelection) {
        selectedCarIndex = selectedCarIndex > 0 ? selectedCarIndex - 1 : carImages.length - 1;
      }
      updateHandPosition();
      updatePreview.call(this);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      if (!inMapSelection && !inGallerySelection  && !isPlaying) {
        selectedMenuIndex = selectedMenuIndex < buttons.length - 1 ? selectedMenuIndex + 1 : 0;
      } else if (inMapSelection) {
        selectedMapIndex = selectedMapIndex < mapImages.length - 1 ? selectedMapIndex + 1 : 0;
      } else if (inGallerySelection) {
        selectedCarIndex = selectedCarIndex < carImages.length - 1 ? selectedCarIndex + 1 : 0;
      }
      updateHandPosition();
      updatePreview.call(this);
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      if (inMapSelection) {
        selectedMapIndex = (selectedMapIndex + 1) % mapImages.length;
        updatePreview.call(this);
      } else if (inGallerySelection) {
        selectedCarIndex = (selectedCarIndex + 1) % carImages.length;
        updatePreview.call(this);
      }
    });

    this.input.keyboard.on("keydown-LEFT", () => {
      if (inMapSelection) {
        selectedMapIndex = (selectedMapIndex - 1 + mapImages.length) % mapImages.length;
        updatePreview.call(this);
      } else if (inGallerySelection) {
        selectedCarIndex = (selectedCarIndex - 1 + carImages.length) % carImages.length;
        updatePreview.call(this);
      }
    });

    updateHandPosition();
}

function update() {}
