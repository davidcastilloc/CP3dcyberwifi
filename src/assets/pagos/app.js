 window.addEventListener("load", function(event) {
	  const vm = new Vue({
			el: "#app",
			data: {
				 Titulo: '3DCyberWifi',
				 Subtitulo: 'Selecciona tu banco y una tarjeta prepagada.',
				 loading: true,
				 btnLoading: false,
				 Bancos: {
					  BancoSeleccionado: {},
					  Bancaribe: {
							id: 1,
							nBanco: 'Bancaribe',
							img: '/assets/pagos/bancos/bancaribe.png',
							smsPago: 'loading'
					  },
					  Banesco: {
							id: 2,
							nBanco: 'Banesco',
							img: '/assets/pagos/bancos/banesco.jpg',
							smsPago: 'loading'
					  },
					  Venezuela: {
							id: 3,
							nBanco: 'Venezuela',
							img: '/assets/pagos/bancos/venezuela.png',
							smsPago: 'loading'
					  }
				 },
				 selector: {
					  Active: undefined,
					  Cards: [{
							"body": "1 Hora",
							"tiempo": 60,
					  }, {
							"body": "12 Horas",
							"tiempo": 720,
					  }, {
							"body": "Libre",
							"tiempo": 1440,
					  }]
				 },
				 cur: 0,
				 costoMin: 0,
				 cantidad: 60,
				 total: ''
			},
			delimiters: ['[[', ']]'],
			created() {
				 this.loading = true
			},
			mounted() {
				 const baseURL = 'http://192.168.0.2:8000/getCostos';
				 var request = new XMLHttpRequest();
				 request.open('GET', baseURL, true);
				 request.responseType = 'json';
				 request.onload = function() {
					  if (this.status >= 200 && this.status < 400) {
							// Todo salio muy bien!
							var resp = this.response;
							vm.cur = resp['tazaDolar']
							vm.costoMin = resp['costoMinuto']
							vm.total = Math.ceil(vm.costoMin * vm.cantidad) + ',00'
							vm.seleccionarBanco(1)
							vm.loading = false
					  } else {
							// la conexion se efectuo pero nos retorno algun error
					  }
				 };
				 request.onerror = function(e) {
					  // Hubo un error de conexión de algún tipo
					  console.log(e)
					  alert("Error La pasarela de pagos esta desconectada.");
				 };
				 request.send();

			},
			methods: {
				 seleccionarBanco: function(banco) {

					  switch (banco) {
							case 1:
								 this.Bancos.BancoSeleccionado = this.Bancos.Bancaribe
								 this.Bancos.BancoSeleccionado.smsPago = this.bancaribe
								 this.Bancos.BancoSeleccionado.numero = 22741
								 this.Bancos.BancoSeleccionado.toString = `mipago V24980047 0114 ${this.total} 04148176793`
								 console.log('bancaribe seleccionado');
								 break;
							case 2:
								 this.Bancos.BancoSeleccionado = this.Bancos.Banesco
								 this.Bancos.BancoSeleccionado.smsPago = this.banesco
								 this.Bancos.BancoSeleccionado.numero = 2846
								 this.Bancos.BancoSeleccionado.toString = `0134 04148176793 V 8276926 ${this.total}`
								 console.log('banesco seleccionado');
								 break;
							case 3:
								 this.Bancos.BancoSeleccionado = this.Bancos.Venezuela
								 this.Bancos.BancoSeleccionado.smsPago = this.venezuela
								 this.Bancos.BancoSeleccionado.numero = 2662
								 this.Bancos.BancoSeleccionado.toString = `mipago V24980047 0114 ${this.total} 04148176793`
								 console.log('venezuela seleccionado');
								 break;
							default:
								 console.log('ValorErroneo!');
					  }
				 },
				 enviarPago: function() {
					  banco = this.Bancos.BancoSeleccionado.id
					  this.btnLoading = true
					  var pre = "sms:04148176793?body="
					  setTimeout(() => this.btnLoading = false, 3000);
					  switch (banco) {
							case 1:
								 window.open(this.bancaribe);
								 console.log('bancaribe seleccionado');
								 break;
							case 2:
								 window.open(this.banesco);
								 console.log('banesco seleccionado');
								 break;
							case 3:
								 window.open(this.venezuela);
								 console.log('venezuela seleccionado');
								 break;
							default:
								 console.log('error');
					  }
					  window.location.replace("/login");

				 },
				 setCard: function(card) {
					  this.cantidad = card.tiempo
					  this.selector.Active = card
				 },
				 calcularTotal() {
					  this.total = Math.ceil(this.costoMin * this.cantidad) + ',00'
					  this.Bancos.Bancaribe.smsPago = this.bancaribe
					  this.Bancos.Banesco.smsPago = this.banesco
					  this.Bancos.Venezuela.smsPago = this.venezuela
				 },
				 isMobile() {
					  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
							return true
					  } else {
							return false
					  }
				 }
			},
			computed: {
				 bancaribe: function() {
					  return `sms:22741;?&body=mipago%20V24980047%200114%20${this.total}%2004148176793`
				 },
				 banesco: function() {
					  return `sms:2846;?&body=0134%2004148176793%20V%208276926%20${this.total}`
				 },
				 venezuela: function() {
					  return `sms:2662;?&body=Pagar%200102%2004148004137%208295544%20${this.total}`
				 }
			},
			watch: {
				 cantidad(val) {
					  if (val <= 99999) {} else {
							this.cantidad = 99999
					  }
					  if (val <= 15) {
							this.cantidad = 15
					  }
					  this.calcularTotal()
				 }
			}
	  })
 });
