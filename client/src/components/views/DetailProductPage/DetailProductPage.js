import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';

function DetailProductPage(props) {

    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})

    useEffect(() => {
        // db에서 하나만 가져오므로 'type=single'
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success){
                    console.log('response.data:', response.data)
                } else{
                    alert('실패')
                }
                setProduct(response.data.product[0])
                console.log('response.data.product[0]: ',response.data.product[0] )
            })
            .catch(err => alert(err))
    }, [])



    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                <Col lg={12} sm={24}>
                    {/* ProductImage */}
                    {/* 프로덕트 모던 정보를 property로 내려준다 -> ProductImage에서 컨트롤 가능 */}
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} sm={24}>
                    {/* ProductInfo */}
                    <ProductInfo detail={Product} />
                </Col>
            </Row>





        </div>
    )
}

export default DetailProductPage
