const socket = io("http://localhost:3000", {
  withCredentials: false,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

console.log(socket);

socket.on('mqtt-message', (data) => {
  console.log('evento gaaaa!');
  const mqttDataElement = document.getElementById('mqtt-data');
  mqttDataElement.textContent = data;
});
