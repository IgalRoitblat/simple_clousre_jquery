var cartGenerator = function() {
	var privateCart = [];
	return {
		change: function(product, quantity) {
			var index = cart.find(product.id);
			if (index >= 0) {
				if (quantity === 0) {
					privateCart.splice(index,1);
				} else {
					privateCart[index].quantity = Number(quantity);
					privateCart[index].price = Number(product.price);
				}
			} else {
				privateCart.push({
					id: product.id, 
					quantity: Number(quantity),
					price: Number(product.price)
				})
			}
			console.log(privateCart);
		},
		find: function(id) {
			for(var i = 0; i < privateCart.length; i++) {
			    if (privateCart[i].id === id) {
			        return i;
			    }
			}
		},
		count: function() {
			var total = 0;
			privateCart.forEach(item => {
				total += item.quantity
			});
			return total;
		},
		sum: function() {
			var total = 0;
			privateCart.forEach(item => {
				total += (item.quantity * item.price)
			});
			return total;
		},
		empty: function() {
			privateCart = [];
		}
	}
}

var cart = cartGenerator();
getCatalog('catalog.json').then(appendData)


function getCatalog(url) {
	return new Promise(function (resolve) {
		$.get(url, function(data) {
			resolve(data);
		});
	})
}

function appendData(data) {
	var products = data.products;
	products.forEach(product => {
		$("main").append(
			$("<div>").addClass("productContainer").append(
				$("<span>", {
					text: product.name
				}),
				$("<img>", {
					src: product.images[0].square
				}),
				$("<span>", {
					text: "Price: " + product.price + " " + product.currency
				}),
				$("<button>", {
					text: "Add", click: (event) => openQuantity(event, product)
				}).addClass("add")
			)
		)
	})

}

function openQuantity(e, product) {
	cart.change(product, 1);
	cartAmount(cart.count(), cart.sum());
	$(e.target).parent().append(
		$("<button>", {
			text: "Remove", 
			click: (event) => closeQuantity(event, product)
		}).addClass("remove"),
		$("<div>").addClass("quantityContainer")
		.append(
			$("<button>", {
				text: "+", 
				click: (event) => increaseValue(event, product)
			}),
			$("<input>", {
				value: "1"
			}),
			$("<button>", {
				text: "-", 
				click: (event) => decreaseValue(event, product)
			})
		)
	)
	$(e.target).remove();
}

function closeQuantity(e, product) {
	$(e.target).siblings("div").remove();
	$(e.target).parent().append(
		$("<button>", {
			text: "Add", click: (event) => openQuantity(event, product)
		}).addClass("add")
	);
	cart.change(product, 0);
	cartAmount(cart.count(), cart.sum());
	$(e.target).remove();
}

function increaseValue(e, product) {
	var prevValue = $(e.target).siblings("input").val();
	var newValue = $(e.target).siblings("input").val(Number(prevValue) + 1);
	cart.change(product, newValue.val());
	cartAmount(cart.count(), cart.sum());
}

function decreaseValue(e, product) {
	var currentValue = $(e.target).siblings("input").val();
	if (currentValue <= 1) {
		cart.change(product, 0);
		cartAmount(cart.count(), cart.sum());
		$(e.target).parent().siblings(".remove").click();
	} else {
		$(e.target).siblings("input").val(Number(currentValue) - 1);
		cart.change(product, $(e.target).siblings("input").val());
		cartAmount(cart.count(), cart.sum());
	} 
}

function cartAmount(count, sum) {
	$("#cart_container").empty();
	if (count === 0) {
		return
	};
	
	$("#cart_container").append(
		$("<span>", {text: "You have " + count + " items in your cart"}),
		$("<span>", {text: "The total sum of the products selected is: " + sum}),
		$("<button>", {text: "Start Over", click: () => {
			$("main").empty();
			cart.empty();
			$("#cart_container").empty();
			getCatalog('catalog.json').then(appendData);

		}})
	)
}

