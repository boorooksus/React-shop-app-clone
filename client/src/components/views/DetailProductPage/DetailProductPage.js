import React, { useEffect, useState } from 'react'
import axios from 'axios';

function DetailProductPage(props) {
    
    const productId = props.match.params.productId

    useEffect(() => {
        // db에서 하나만 가져오므로 'type=single'
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success){
                    console.log('response.data', response.data)
                } else{
                    alert('상품 정보 실패')
                }
            })
    }, [])

    return(
        <div>
            detailProductPage
        </div>
    )
}

export default DetailProductPage
