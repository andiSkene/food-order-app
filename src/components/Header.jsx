import { useContext } from 'react';
import titleImg from '../assets/logo.jpg';
import Button from './UI/Button.jsx';
import CartContext from './store/CartContext.jsx';
import UserProgressContext from './store/UserProgressContext.jsx';

export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const itemNumber = cartCtx.items.reduce((totalNumber, item) => {
        return totalNumber + item.quantity;
    }, 0);

    function showCartHandler(){
        userProgressCtx.showCart();
    }

    return <header id="main-header">
        <div id="title">
            <img src={titleImg} alt="place setting"></img>
            <h1>MidTier Restaurant</h1>
        </div>
        <nav>
            <Button textOnly onClick={showCartHandler}>Cart ({itemNumber})</Button>
        </nav>
    </header>
}