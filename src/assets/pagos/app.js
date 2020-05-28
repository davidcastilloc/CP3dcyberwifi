 window.addEventListener("load", function (event) {
 	const vm = new Vue({
 		el: "#app",
 		data: {
 			Titulo: '3DCyberWifi',
 			Subtitulo: 'Selecciona tu banco y una tarjeta prepagada.',
 			loading: true,
 			btnLoading: false,
 			Bancos: {
 				BancoSeleccionado: {
 					id: 0,
 					nombre: 'Bancaribe',
 					img: '/assets/pagos/bancos/bancaribe.png',
 					smsPago: 'loading',
 					numero: 22741
 				},
 				lista: [{
 					nombre: 'Bancaribe',
 					img: '/assets/pagos/bancos/bancaribe.png',
 					smsPago: 'loading',
 					numero: 22741
 				}, {
 					nombre: 'Banesco',
 					img: '/assets/pagos/bancos/banesco.jpg',
 					smsPago: 'loading',
 					numero: 2846
 				}, {
 					nombre: 'Venezuela',
 					img: '/assets/pagos/bancos/venezuela.png',
 					smsPago: 'loading',
 					numero: 2662
 				}]
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
 			request.onload = function () {
 				if (this.status >= 200 && this.status < 400) {
 					// Todo salio muy bien!
 					var resp = this.response;
 					vm.cur = resp['tazaDolar']
 					vm.costoMin = resp['costoMinuto']
 					vm.loading = false
 				} else {
 					// la conexion se efectuo pero nos retorno algun error
 				}
 			};
 			request.onerror = function (e) {
 				// Hubo un error de conexión de algún tipo
 				console.log(e)
 				alert("Error La pasarela de pagos esta desconectada.");
 			};
 			request.send();
 		},
 		methods: {
 			seleccionarBanco: function (banco, index) {
 				switch (index) {
 					case 0:
 						this.Bancos.BancoSeleccionado = this.Bancos.lista[index]
 						this.Bancos.BancoSeleccionado.id = index
 						this.Bancos.BancoSeleccionado.toString = `mipago V24980047 0114 ${this.total} 04148176793`
 						break;
 					case 1:
 						this.Bancos.BancoSeleccionado = this.Bancos.lista[index]
 						this.Bancos.BancoSeleccionado.id = index
 						this.Bancos.BancoSeleccionado.smsPago = this.Bancos.lista[index].smsPago
 						this.Bancos.BancoSeleccionado.toString = `0134 04148176793 V 8276926 ${this.costoMin * this.cantidad},00`
 						break;
 					case 2:
 						this.Bancos.BancoSeleccionado = this.Bancos.lista[index]
 						this.Bancos.BancoSeleccionado.id = index
 						this.Bancos.BancoSeleccionado.toString = `Pagar 0102 04148004137 8295544 ${this.costoMin * this.cantidad},00`
 						break;
 					default:
 						console.log('ValorErroneo!');
 				}
 			},
 			enviarPago: function () {
 				banco = this.Bancos.BancoSeleccionado.id
 				this.btnLoading = true
 				setTimeout(() => this.btnLoading = false, 3000);
 				switch (banco) {
 					case 1:
 						window.open(this.bancaribe);
 						break;
 					case 2:
 						window.open(this.banesco);
 						break;
 					case 3:
 						window.open(this.venezuela);
 						break;
 					default:
 						console.log('error');
 				}
 				window.location.replace("/login");
 			},
 			setCard: function (card) {
 				 this.cantidad = card.tiempo
				 this.selector.Active = card
				 switch (this.Bancos.BancoSeleccionado.id) {
				 	case 0:
				 		this.Bancos.BancoSeleccionado.toString = `mipago V24980047 0114 ${this.total} 04148176793`
				 		break;
				 	case 1:
				 		this.Bancos.BancoSeleccionado.toString = `0134 04148176793 V 8276926 ${this.total}`
				 		break;
				 	case 2:
				 		this.Bancos.BancoSeleccionado.toString = `Pagar 0102 04148004137 8295544 ${this.total}`
				 		break;
				 	default:
				 		console.log('ValorErroneo!');
				 }
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
 			total: function () {
 				return Math.ceil(this.costoMin * this.cantidad) + ',00'
 			},
 			bancaribe: function () {
 				return `sms:22741;?&body=mipago%20V24980047%200114%20${this.total}%2004148176793`
 			},
 			banesco: function () {
 				return `sms:2846;?&body=0134%2004148176793%20V%208276926%20${this.total}`
 			},
 			venezuela: function () {
 				return `sms:2662;?&body=Pagar%200102%2004148004137%208295544%20${this.total}`
 			}
 		},
 		watch: {}
 	})
 });
