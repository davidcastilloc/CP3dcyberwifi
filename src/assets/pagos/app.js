 window.addEventListener("load", function(event) {
	const vm = new Vue({
	el: "#app",
	data: {
			msg: 'Pago movil facil',
			loading: true,
			btnLoading: false,
			Bancos: {
					BancoSeleccionado: {
							id: 1,
							nBanco: 'Bancaribe',
							img: '/assets/pagos/bancos/bancaribe.png',
							smsPago: 'loading'
					},
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
							},

							{
									"body": "Libre",
									"tiempo": 1440,
							}
					]
			},
			cur: 0,
			costoMin: 0,
			cantidad: 1,
			total: ''
	},
	delimiters: ['[[', ']]'],
	created() {
		this.loading = true
		this.Bancos.BancoSeleccionado.smsPago = this.bancaribe
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
				vm.loading = false
			} else {
				// la conexion se efectuo pero nos retorno algun error
			}
		};
		request.onerror = function(e) {
			// Hubo un error de conexión de algún tipo
			console.log(e)
			alert("Error " + e + " occurred while receiving the document.");
		};
		request.send();
	},
	methods: {
		seleccionarBanco: function(banco) {
				this.Bancos.BancoSeleccionado = this.Bancos.Bancaribe
				switch (banco) {
						case 1:
								this.Bancos.BancoSeleccionado = this.Bancos.Bancaribe
								this.Bancos.BancoSeleccionado.smsPago = this.bancaribe
								console.log('bancaribe seleccionado');
								break;
						case 2:
								this.Bancos.BancoSeleccionado = this.Bancos.Banesco
								this.Bancos.BancoSeleccionado.smsPago = this.banesco
								console.log('banesco seleccionado');
								break;
						case 3:
								this.Bancos.BancoSeleccionado = this.Bancos.Venezuela
								this.Bancos.BancoSeleccionado.smsPago = this.venezuela
								console.log('venezuela seleccionado');
								break;
						default:
								console.log('Lo lamentamos, por el momento no disponemos de ' + expr + '.');
				}
			},
			enviarPago: function() {
					banco = this.Bancos.BancoSeleccionado.id
					this.btnLoading = true
					var pre = "sms:04148176793?body="
					setTimeout(() => this.btnLoading = false, 1000);
					switch (banco) {
							case 1:
									window.open(pre+this.bancaribe, '_blank', '', 'false');
									console.log('bancaribe seleccionado');
									break;
							case 2:
									window.open(pre+this.banesco, '_blank', '', 'false');
									console.log('banesco seleccionado');
									break;
							case 3:
									window.open(pre+this.venezuela, '_blank', '', 'false');
									console.log('venezuela seleccionado');
									break;
							default:
									console.log('error');
					}

			},
			setCard: function(card) {
					this.cantidad = card.tiempo
					this.selector.Active = card
					this.total = Math.ceil(this.costoMin * this.cantidad) + ',00'
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
			return `mipago V24980047 0114 ${this.total} 04148176793`
		},
		banesco: function() {
			return `0134 04148176793 V 8276926 ${this.total}`
		},
		venezuela: function() {
			return `Pagar 0102 04148004137 8295544 ${this.total}`
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
			this.total = Math.ceil(this.costoMin * this.cantidad) + ',00'
			this.Bancos.BancoSeleccionado.smsPago = this.total
		}
	}
})
});
