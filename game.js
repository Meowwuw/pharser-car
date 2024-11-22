const config = {
  type: Phaser.AUTO,
  width: 1440,
  height: 880,
  parent: "gameContainer",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
let coinGroup;
let coinCounter = 0;
let scoreText;
let totalCoins = 0;
let background1, background2;
let currentPistaMusic;
let coinSound;

const mapImages = ["mapa1", "mapa2", "mapa3", "mapa4", "mapa5"];
const pistaImages = ["pista1", "pista2", "pista3", "pista4", "pista5"];
const carImages = ["car1", "car2", "car3", "car4", "car5"];
const pistaMusics = [
  "musicPista1",
  "musicPista2",
  "musicPista3",
  "musicPista4",
  "musicPista5",
];

const unlockedCars = [true, true, false, false, false];
const unlockedMaps = [true, false, false, false, false];

function preload() {
  this.load.image("mapa1", "img/mapa1.png");
  this.load.image("mapa2", "img/mapa2.png");
  this.load.image("mapa3", "img/mapa3.jpg");
  this.load.image("mapa4", "img/mapa4.jpg");
  this.load.image("mapa5", "img/mapa5.jpg");
  this.load.image("pista1", "img/pista-mapa1.png");
  this.load.image("pista2", "img/pista-mapa2.png");
  this.load.image("pista3", "img/pista-mapa3.png");
  this.load.image("pista4", "img/pista-mapa4.png");
  this.load.image("pista5", "img/pista-mapa5.png");

  this.load.audio("menuMusic", "music/musica1.mp3");
  this.load.audio("musicPista1", "music/musica-pista1.mp3");
  this.load.audio("musicPista2", "music/musica-pista2.mp3");
  this.load.audio("musicPista3", "music/musica-pista3.mp3");
  this.load.audio("musicPista4", "music/musica-pista5.mp3");
  this.load.audio("musicPista5", "music/musica-pista4.mp3");

  this.load.audio("coinSound", "music/coin.mp3");
  this.load.audio("creditsMusic", "music/credits-music.mp3");

  this.load.image("car1", "img/car1.png");
  this.load.image("car2", "img/car2.png");
  this.load.image("car3", "img/car3.png");
  this.load.image("car4", "img/car4.png");
  this.load.image("car5", "img/car5.png");

  this.load.image("menu1", "img/menu1.png");
  this.load.image("menu2", "img/menu2.png");
  this.load.image("mano", "img/mano.png");
  this.load.image("flecha", "img/arrow.png");
  this.load.image("moneda", "img/coin.png");
}

function create() {
  localStorage.clear();
  totalCoins = 0;
  coinCounter = 0;
  background1 = this.add.image(0, 0, selectedMap).setOrigin(0, 0);
  background2 = this.add.image(0, -config.height, selectedMap).setOrigin(0, 0);
  background1.setDisplaySize(config.width, config.height);
  background2.setDisplaySize(config.width, config.height);

  localStorage.removeItem("totalCoins");
  background1 = this.add.image(0, 0, selectedMap).setOrigin(0, 0);
  background2 = this.add.image(0, -config.height, selectedMap).setOrigin(0, 0);
  background1.setDisplaySize(config.width, config.height);
  background2.setDisplaySize(config.width, config.height);

  const menuMusic = this.sound.add("menuMusic", { loop: true });
  menuMusic.play();

  coinSound = this.sound.add("coinSound");

  // Carrito
  carSprite = this.physics.add
    .sprite(
      config.width / 2,
      config.height / 2 + 300,
      carImages[selectedCarIndex]
    )
    .setOrigin(0.5);
  carSprite.setVisible(false);
  carSprite.setCollideWorldBounds(true);
  carSprite.setBounce(0.5); // Rebote
  carSprite.setGravityY(0); // Gravedad en Y (0 desactiva)

  //Monedas
  coinGroup = this.physics.add.group();

  scoreText = this.add.text(20, 20, "Monedas: 0", {
    fontSize: "32px",
    fill: "#ffffff",
    fontFamily: '"Irish Grover", system-ui',
  });

  this.physics.add.overlap(carSprite, coinGroup, collectCoin, null, this);
  this.time.addEvent({
    delay: 1000,
    callback: spawnCoin,
    callbackScope: this,
    loop: true,
  });

  function spawnCoin() {
    if (!isPlaying) return;

    if (coinGroup.getChildren().length >= 4) {
      return;
    }

    const x = Phaser.Math.Between(50, config.width - 50);
    const y = -50;
    const coin = coinGroup.create(x, y, "moneda");
    coin.setVelocityY(200);
    coin.setCollideWorldBounds(false);
    coin.setScale(0.35);
  }

  function collectCoin(car, coin) {
    coin.destroy();
    totalCoins++; // Incrementa directamente las monedas totales
    scoreText.setText(`Monedas: ${totalCoins}`); // Actualiza el texto
    coinSound.play();
  }

  function showCredits(scene) {
    const creditsBackground = scene.add.rectangle(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
      0x000000
    );

    const studentNames = [
      "Mauricio hitlist",
      "No-Nigth",
      "Rider",
      "Cris",
      "Vin",
      "你好",
      "Renzo S.",
      "Emmanuel M.",
      "1011010",
      "Lluncor.com",
    ];

    const creditsGroup = scene.add.group();

    let startY = 900;

    studentNames.forEach((name, index) => {
      const nameText = scene.add
        .text(720, startY + index * 50, name, {
          fontSize: "32px",
          fill: "#ffffff",
          fontFamily: '"Irish Grover", system-ui',
          align: "center",
        })
        .setOrigin(0.5);
      creditsGroup.add(nameText);
    });

    const finalMessage = scene.add
      .text(
        720,
        startY + studentNames.length * 50 + 100,
        "¡Gracias por jugar! Sigue luchando por tus sueños.",
        {
          fontSize: "36px",
          fill: "#FFD700",
          fontFamily: '"Irish Grover", system-ui',
          align: "center",
        }
      )
      .setOrigin(0.5);
    creditsGroup.add(finalMessage);

    const creditsMusic = scene.sound.add("creditsMusic", { loop: true });
    creditsMusic.play();

    scene.tweens.add({
      targets: creditsGroup.getChildren(),
      y: "-=1000",
      duration: 15000,
      ease: "Linear",
      onComplete: () => {
        creditsMusic.stop();
        scene.scene.restart();
      },
    });
  }

  // Div blanco con transparencia
  const menuBackground = this.add.rectangle(720, 450, 380, 520, 0xffffff, 0.8);
  menuBackground.setStrokeStyle(2, 0xcccccc);
  menuBackground.setOrigin(0.5);

  // Encabezado y pie de menú
  const menuHeader = this.add
    .image(720, 240, "menu1")
    .setOrigin(0.5)
    .setDisplaySize(280, 50);
  const titleText = this.add
    .text(720, 240, "Drive collector", {
      fontSize: "32px",
      fill: "#1E21E5",
      fontFamily: '"Irish Grover", system-ui',
    })
    .setOrigin(0.5);

  const menuFooter = this.add
    .image(720, 650, "menu2")
    .setOrigin(0.5)
    .setDisplaySize(280, 50);

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

  const playButton = this.add
    .text(720, 350, "PLAY", buttonStyle)
    .setOrigin(0.5);
  const galleryButton = this.add
    .text(720, 420, "GALERIA", buttonStyle)
    .setOrigin(0.5);
  const mapButton = this.add
    .text(720, 490, "MAPAS", buttonStyle)
    .setOrigin(0.5);
  const creditsButton = this.add
    .text(720, 560, "CREDITS", buttonStyle)
    .setOrigin(0.5);
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
    buttons.forEach((button) => button.setVisible(visible));
  }

  let previewImage;
  const leftArrow = this.add
    .image(880, 450, "flecha")
    .setOrigin(0.5)
    .setInteractive()
    .setDisplaySize(50, 50);
  const rightArrow = this.add
    .image(560, 450, "flecha")
    .setOrigin(0.5)
    .setInteractive()
    .setDisplaySize(50, 50);
  rightArrow.flipX = true;
  leftArrow.setVisible(false);
  rightArrow.setVisible(false);

  function updatePreview() {
    if (inMapSelection) {
      if (previewImage) previewImage.destroy();

      if (unlockedMaps[selectedMapIndex]) {
        // Mostrar mapa desbloqueado
        previewImage = this.add
          .image(720, 450, mapImages[selectedMapIndex])
          .setOrigin(0.5)
          .setDisplaySize(250, 200);
      } else {
        // Mostrar mensaje de bloqueado con las monedas necesarias
        const coinsNeeded = (selectedMapIndex + 1) * 5; // Ejemplo: 15, 20, 25...
        previewImage = this.add
          .text(720, 450, `BLOQUEADO`, {
            fontSize: "32px",
            fill: "#ff0000",
            fontFamily: '"Irish Grover", system-ui',
            align: "center",
          })
          .setOrigin(0.5);
      }

      leftArrow.setVisible(true);
      rightArrow.setVisible(true);
    } else if (inGallerySelection) {
      if (previewImage) previewImage.destroy();

      if (unlockedCars[selectedCarIndex]) {
        // Mostrar carro desbloqueado
        previewImage = this.add
          .image(720, 450, carImages[selectedCarIndex])
          .setOrigin(0.5)
          .setDisplaySize(250, 200);
      } else {
        const coinsNeeded = (selectedCarIndex + 1) * 5;
        previewImage = this.add
          .text(720, 450, `BLOQUEADO`, {
            fontSize: "32px",
            fill: "#ff0000",
            fontFamily: '"Irish Grover", system-ui',
            align: "center",
          })
          .setOrigin(0.5);
      }

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
    carSprite.setPosition(config.width / 2, config.height / 2 + 300);
  }

  this.input.keyboard.on("keydown-ENTER", () => {
    if (!inMapSelection && !inGallerySelection && !isPlaying) {
      switch (selectedMenuIndex) {
        case 3:
          toggleMenuButtons(false);
          menuBackground.setVisible(false);
          menuHeader.setVisible(false);
          menuFooter.setVisible(false);
          titleText.setVisible(false);
          showCredits(this);
          menuMusic.pause();
          break;

        case 2:
          inMapSelection = true;
          titleText.setText("MAPAS");
          toggleMenuButtons(false);
          updatePreview.call(this);
          break;

        case 1:
          inGallerySelection = true;
          titleText.setText("GALERIA");
          toggleMenuButtons(false);
          updatePreview.call(this);
          break;

          case 0: // Jugar
          toggleMenuButtons(false);
          menuBackground.setVisible(false);
          menuHeader.setVisible(false);
          menuFooter.setVisible(false);
          titleText.setVisible(false);
          carSprite.setVisible(true);
          isPlaying = true;
          if (menuMusic.isPlaying) {
              menuMusic.pause();
          }
      
          if (currentPistaMusic && currentPistaMusic.isPaused) {
              currentPistaMusic.resume();
          } else {
              if (currentPistaMusic) {
                  currentPistaMusic.stop();
              }
              currentPistaMusic = this.sound.add(pistaMusics[selectedMapIndex], {
                  loop: true,
              });
              currentPistaMusic.play();
          }
      
          this.time.addEvent({
              delay: 3000,
              callback: spawnCoin,
              callbackScope: this,
              loop: true,
          });
          break;
      

        default:
          console.log("Opción no válida");
      }
    } else if (inMapSelection) {
      const mapCosts = [0, 15, 20, 25, 30];
      const coinsNeeded = mapCosts[selectedMapIndex];

      if (unlockedMaps[selectedMapIndex]) {
        background1.setTexture(pistaImages[selectedMapIndex]);
        background2.setTexture(pistaImages[selectedMapIndex]);
        inMapSelection = false;
        titleText.setText("Drive collector");
        toggleMenuButtons(true);
        updatePreview.call(this);
        if (currentPistaMusic) {
          currentPistaMusic.stop(); 
        }

        currentPistaMusic = this.sound.add(pistaMusics[selectedMapIndex], {
          loop: true,
        });
      } else if (totalCoins >= coinsNeeded) {
        totalCoins -= coinsNeeded;
        unlockedMaps[selectedMapIndex] = true;
        scoreText.setText(`Monedas: ${totalCoins}`);
        updatePreview.call(this);

        const successMessage = this.add
          .text(720, 600, `¡Mapa ${selectedMapIndex + 1} desbloqueado!`, {
            fontSize: "28px",
            fill: "#00ff00",
            fontFamily: '"Irish Grover", system-ui',
            align: "center",
          })
          .setOrigin(0.5);

        this.time.delayedCall(2000, () => successMessage.destroy());
      } else {
        const errorMessage = this.add
          .text(
            720,
            600,
            `No tienes suficientes monedas\nSe necesitan ${coinsNeeded} monedas`,
            {
              fontSize: "28px",
              fill: "#ff0000",
              fontFamily: '"Irish Grover", system-ui',
              align: "center",
            }
          )
          .setOrigin(0.5);

        this.time.delayedCall(2000, () => errorMessage.destroy());
      }
    } else if (inGallerySelection) {
      // Selección de galería
      const carCosts = [0, 0, 15, 20, 25];
      const coinsNeeded = carCosts[selectedCarIndex];

      if (unlockedCars[selectedCarIndex]) {
        // Carro desbloqueado
        repositionCar();
        inGallerySelection = false;
        titleText.setText("Drive collector");
        toggleMenuButtons(true);
        updatePreview.call(this);
      } else if (totalCoins >= coinsNeeded) {
        // Desbloquear carro
        totalCoins -= coinsNeeded;
        unlockedCars[selectedCarIndex] = true;
        scoreText.setText(`Monedas: ${totalCoins}`);
        updatePreview.call(this);

        // Mostrar mensaje de éxito
        const successMessage = this.add
          .text(720, 600, `¡Carro ${selectedCarIndex + 1} desbloqueado!`, {
            fontSize: "28px",
            fill: "#00ff00",
            fontFamily: '"Irish Grover", system-ui',
            align: "center",
          })
          .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
          successMessage.destroy();
        });
      } else {
        // Monedas insuficientes
        const errorMessage = this.add
          .text(
            720,
            600,
            `No tienes suficientes monedas\nSe necesitan ${coinsNeeded} monedas`,
            {
              fontSize: "28px",
              fill: "#ff0000",
              fontFamily: '"Irish Grover", system-ui',
              align: "center",
            }
          )
          .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
          errorMessage.destroy();
        });
      }
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
        toggleMenuButtons(true);
        carSprite.setVisible(false);

        if (currentPistaMusic && currentPistaMusic.isPlaying) {
            currentPistaMusic.pause();
        }

        if (!menuMusic.isPlaying) {
            menuMusic.resume();
        }
    }
});


  this.input.keyboard.on("keydown-UP", () => {
    if (!inMapSelection && !inGallerySelection && !isPlaying) {
      selectedMenuIndex =
        selectedMenuIndex > 0 ? selectedMenuIndex - 1 : buttons.length - 1;
    } else if (inMapSelection) {
      selectedMapIndex =
        selectedMapIndex > 0 ? selectedMapIndex - 1 : mapImages.length - 1;
    } else if (inGallerySelection) {
      selectedCarIndex =
        selectedCarIndex > 0 ? selectedCarIndex - 1 : carImages.length - 1;
    }
    updateHandPosition();
    updatePreview.call(this);
  });

  this.input.keyboard.on("keydown-DOWN", () => {
    if (!inMapSelection && !inGallerySelection && !isPlaying) {
      selectedMenuIndex =
        selectedMenuIndex < buttons.length - 1 ? selectedMenuIndex + 1 : 0;
    } else if (inMapSelection) {
      selectedMapIndex =
        selectedMapIndex < mapImages.length - 1 ? selectedMapIndex + 1 : 0;
    } else if (inGallerySelection) {
      selectedCarIndex =
        selectedCarIndex < carImages.length - 1 ? selectedCarIndex + 1 : 0;
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
      selectedMapIndex =
        (selectedMapIndex - 1 + mapImages.length) % mapImages.length;
      updatePreview.call(this);
    } else if (inGallerySelection) {
      selectedCarIndex =
        (selectedCarIndex - 1 + carImages.length) % carImages.length;
      updatePreview.call(this);
    }
  });

  updateHandPosition();
}

function update() {
  if (isPlaying) {
    const cursors = this.input.keyboard.createCursorKeys();
    background1.y += 15;
    background2.y += 15;

    if (background1.y >= config.height) {
      background1.y = background2.y - config.height;
    }

    if (background2.y >= config.height) {
      background2.y = background1.y - config.height;
    }

    //Izquierda
    if (cursors.left.isDown) {
      carSprite.setVelocityX(-200);
    }
    //Derecha
    else if (cursors.right.isDown) {
      carSprite.setVelocityX(200);
    }
    //En espera
    else {
      carSprite.setVelocityX(0);
    }

    //Arriba
    if (cursors.up.isDown) {
      carSprite.setVelocityY(-200);
    }
    //Abajo
    else if (cursors.down.isDown) {
      carSprite.setVelocityY(200);
    }
    //En espera
    else {
      carSprite.setVelocityY(0);
    }

    //background.tilePositionY +=5;

    coinGroup.getChildren().forEach((coin) => {
      if (coin.y > config.height) {
        coin.destroy();
      }
    });
  }
}
