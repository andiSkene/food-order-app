import { useContext } from 'react';
import Modal from '../components/UI/Modal.jsx';
import CartContext from './store/CartContext.jsx';
import { currencyFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from './store/UserProgressContext.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig,);

    const CartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price;
    }, 0);

    function onSubmitHandler(event) {
        event.preventDefault();
        //userProgressCtx.hideCheckout();

        //validation already done

        //this is the native browsers special constructor
        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        //send customerData and cart to backend
        //check backend/app.js to find endpoint
        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            }
            )
        );
    }

    function onCloseHandler() {
        userProgressCtx.hideCheckout();
    }

    function onFinishHandler() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    let actions = (
        <>
            <Button onClick={onCloseHandler} type="button" textOnly>Close</Button>
            <Button>Submit Order</Button>
        </>
    )

    if (isSending) {
        actions = <span>
            Sending order...
        </span>
    }

    if (data && !error){
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={onFinishHandler}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will get back to you with more details via email within the next few minutes.</p>
            <p className="modal-actions">
                <Button onClick={onFinishHandler}>Okay</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={onCloseHandler}>
        <form onSubmit={onSubmitHandler}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(CartTotal)}</p>

            <Input label='Full Name' type='text' id='name' />
            <Input label='Email' type='email' id='email' />
            <Input label='Street' type='text' id='street' />
            <div className="control-row">
                <Input label='Postal Code' type='text' id='postal-code' />
                <Input label='City' type='text' id='city' />
            </div>

            {error && <Error title="Failed to submit order." message={error} />}

            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}