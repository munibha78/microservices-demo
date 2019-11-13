import { sleep } from "k6";

// Import pages
import { frontpage } from "./pages/frontpage.js"
import { setCurrency } from "./pages/set_currency.js"
import { browseProduct } from "./pages/browse_product.js"
import { viewCart } from "./pages/view_cart.js"
import { addToCart } from "./pages/add_to_cart.js"
import { checkout } from "./pages/checkout.js"
import { randomChoice } from "./pages/utils.js"

// Test configuration
export let options = {
    stages: [
        {target: 50, duration: '10s'},
        {target: 50, duration: '10s'}
    ],
    thresholds: {
        "http_req_duration": ["p(95)<100"]
    },
    ext: {
        loadimpact: {
            name: "Microservices Demo",
            projectID: 3474085
        }
    }
};

// Load product IDs from file for parameterization
const products = JSON.parse(open("./data/products.json"));

// Setup config to pass to pages
const config = {
    host: __ENV.HOST || 'http://a0674ef41059e11ea85a10aa294b4f69-1484339700.eu-west-1.elb.amazonaws.com',
    products: products,
    currencies: ['EUR', 'USD', 'JPY', 'CAD']
};

export default function() {
    let pages = [frontpage, setCurrency, browseProduct, viewCart, addToCart, checkout];

    // Visit 3 random pages
    randomChoice(pages)(config);
    randomChoice(pages)(config);
    randomChoice(pages)(config);

    // Wait between 3 and 5 seconds before next iteration
    sleep(3+Math.random()*2);
}