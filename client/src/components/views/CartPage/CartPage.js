import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {

    const dispatch = useDispatch();

    useEffect(() => {

        let cartItems = []
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))
            }
        }
    }, [props.user.userData])


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>

            <div>
                {/* props에 cartDetail이 있는지 확인 안하면 너무 빨리 전달돼서 cartDetail이 업데이트 안돼서 에러 날 수 있음 */}
                <UserCardBlock products={props.user.cartDetail && props.user.cartDetail.product}/>
            </div>
        </div>
    )
}

export default CartPage
