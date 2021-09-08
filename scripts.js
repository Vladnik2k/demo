const cubes = [];
let frames = 0;

let isExponentSpeed = false;
let cameraAside = false;

let exponentSpeedInUse = false;

document.getElementById('camera-aside').addEventListener('change', ($event) => {
    cameraAside = $event.target.checked;
});
document.getElementById('exponent').addEventListener('change', ($event) => {
    isExponentSpeed = $event.target.checked;
});

function createObjects() {
    let isStartWithBlack = true;
    for (let i = -columns; i <= columns; i++) {
        isStartWithBlack = !isStartWithBlack;

        for (let j = -rows, isWhite = isStartWithBlack; j <= rows; j++, isWhite = !isWhite) {
            const cube = new Cube({ x: i * blockSize, y: j * blockSize }, isWhite ? white : black);
            cube.divide();
            scene.add(cube.object);
            cubes.push(cube);
        }
    }
}

function changeObjects() {
    cubes.forEach(cube => cube.revertSmallCubes());
}

function start() {
    changeObjects();
    camera.position.z = cameraZPositionStart;
    camera.position.y = - blockSize / 2;

    camera.position.x = cameraAside ? -cameraZPositionStart : 0;
    camera.lookAt(0, camera.position.y, 0);
    exponentSpeedInUse = isExponentSpeed;

    frames = 0;
}

function changeCameraPosition() {
    if (exponentSpeedInUse) {
        camera.position.z = (3.15 * Math.exp(- 3 * frames / speedSlow / cameraZPositionStart) - 0.15) * cameraZPositionFinish;
    } else {
        camera.position.z = (cameraZPositionStart - 3 * frames / speedSlow);
    }
}

function moveCubes() {
    for (let i = 0; i < cubes.length; i++) {
        cubes[i].move(frames);
    }
}

function animation() {
    renderer.render(scene, camera);
    if (camera.position.z <= cameraZPositionFinish) {
        start();
    }

    moveCubes();
    changeCameraPosition();

    frames++;
    stats.update();
    requestAnimationFrame(animation);
}

scene.background = new THREE.Color( white );
createObjects();
start();
animation();
