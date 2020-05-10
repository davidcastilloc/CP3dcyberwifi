const vm = new Vue({
	el: "#app",
	data: {
		msg: 'Pago movil facil',
		cur: 0,
		hora: 0.075,
		horaenbs: 0,
		cantidad: 1,
		costo: ''
	},
	created(){
		/**
		 * classic
		 */
		axios.get('http://s3.amazonaws.com/dolartoday/data.json').then((res) => {
			this.cur = res.data.USD['dolartoday']
			this.horaenbs =  Math.ceil(this.cur * this.hora)
			this.costo = Math.ceil(this.horaenbs * this.cantidad) + ',00'
		})
	},
	methods:{
		enviarPago: function (banco) {
    	window.open(this.bancaribe, '_blank');
    }
	},
	computed:{

		bancaribe: function() {
			return `sms:04148176793?body=mipago V24980047 0114 ${this.costo} 04148176793`

		},
		banesco: function() {
			return `sms:04148176793?body=0134 04148176793 V 8276926 ${this.costo}`

		},
		venezuela: function() {
			return `sms:04148176793?body=Pagar 0102 04148004137 8295544 ${this.costo}`

		}
	},
	watch:{
		cantidad(val){
			if (val <=10) {
			}else{
				this.cantidad = 10
			}

			if (val <= 1) {
				this.cantidad = 1
			}
			this.costo = Math.ceil((this.cur * this.hora) * this.cantidad) + ',00'
		}
	},
	template: '#template'
})
