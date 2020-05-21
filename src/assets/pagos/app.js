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
            },
            Bancaribe: {
                id: 1,
                nBanco: 'Bancaribe',
                img: '/assets/pagos/bancos/bancaribe.png',
            },
            Banesco: {
                id: 2,
                nBanco: 'Banesco',
                img: '/assets/pagos/bancos/banesco.jpg',
            },
            Venezuela: {
                id: 3,
                nBanco: 'Venezuela',
                img: '/assets/pagos/bancos/venezuela.png',
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
        /**
         * classic
         */
        this.selector.Active = {
            "body": "1 Hora",
            "tiempo": 60,
        };
        this.cantidad.Active
        try {
            // statements
            axios.get('http://localhost:8000/getCostos', { crossDomain: true }).then((res) => {
                this.cur = res.data['tazaDolar']
                this.costoMin = res.data['costoMinuto']
                this.total = Math.ceil(this.costoMin * this.cantidad) + ',00'
                this.loading = false
            })
        } catch (e) {
            // statements
            console.log(e);
        } finally {}
    },
    methods: {
        seleccionarBanco: function(banco) {
            this.Bancos.BancoSeleccionado = this.Bancos.Bancaribe
            switch (banco) {
                case 1:
                    this.Bancos.BancoSeleccionado = this.Bancos.Bancaribe
                    console.log('bancaribe seleccionado');
                    break;
                case 2:
                    this.Bancos.BancoSeleccionado = this.Bancos.Banesco
                    console.log('banesco seleccionado');
                    break;
                case 3:
                    this.Bancos.BancoSeleccionado = this.Bancos.Venezuela
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
        }
    }
})
