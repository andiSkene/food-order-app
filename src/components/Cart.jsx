import { useContext } from "react";
import Modal from "./UI/Modal.jsx"
import CartContext from "./store/CartContext.jsx";
import { currencyFormatter } from '../util/formatting.js';
import Button from "./UI/Button.jsx";
import CartItem from "./CartItem.jsx";
import UserProgressContext from './store/UserProgressContext.jsx';

export default function Cart() {
    const CartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const CartTotal = CartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price;
    }, 0);

    function showCheckoutHandler() {
        userProgressCtx.showCheckout();
    }

    function hideCartHandler() {
        userProgressCtx.hideCart();
    }

    return <Modal modalClassName="cart"
        open={userProgressCtx.progress === 'cart'}
        onClose={userProgressCtx.progress === 'cart' ? hideCartHandler : null}>
        <h2>Your Cart</h2>
        <ul>
            {CartCtx.items.map(item => <CartItem
                key={item.id}
                name={item.name}
                quantity={item.quantity}
                price={item.price}
                onIncrease={() => CartCtx.addItem(item)}
                onDecrease={() => CartCtx.removeItem(item.id)}
            />)}
        </ul>
        <p className="cart-total">{currencyFormatter.format(CartTotal)}</p>
        <p className="modal-actions">
            <Button textOnly onClick={hideCartHandler}>Close</Button>
            {CartCtx.items.length > 0 && <Button onClick={showCheckoutHandler}>Go To Checkout</Button>}
        </p>
    </Modal>
}