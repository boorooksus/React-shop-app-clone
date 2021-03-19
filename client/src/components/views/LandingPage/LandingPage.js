import React, { useEffect, useState } from 'react'
import axios from "axios";
import {  Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';

function LandingPage() {

    // 상품 정보들을 state에 담아서 활용
    const [Products, setProducts] = useState([])

    useEffect(() => {
        axios.post('/api/product/products')
            .then(response => {
                if (response.data.success){
                    setProducts(response.data.productInfo)
                } else{
                    alert("상품들을 가져오는데 실패")
                }
            })
    }, [])

    // 상품 정보들 카드에 mapping
    const renderCards = Products.map((product, index) => {
        // 한 줄 너비는 24사이즈 
        // => 한줄에 이미지 4개 -> 이미지 사이즈: 6, 3개 -> 8, 1개 -> 24
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images} />}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />

            </Card>
        </Col>
    })

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere  </h2>
            </div>


            {/* Search */}


            {/* Cards */}

            {/* 카드 간의 간격 */}
            <Row gutter={[16, 16]} >
                {renderCards}
            </Row>

            <br />

  
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button>더보기</button>
            </div>


        </div>
    )
}

export default LandingPage
