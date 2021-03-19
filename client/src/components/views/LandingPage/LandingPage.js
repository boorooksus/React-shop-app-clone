import React, { useEffect, useState } from 'react'
import axios from "axios";
import {  Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import { continents } from './Sections/Datas';

function LandingPage() {

    // 상품 정보들을 state에 담아서 활용
    const [Products, setProducts] = useState([])
    // 몽고db의 skip과 limit을 위한 state
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)  // 처음 메인 화면에 상품 8개 가져옴
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {
        // 상품 개수 몇개 가저올지 조절
        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        // 더보기 버튼을 누른 경우
                        // 원래 product 가져오고 그 이후의 정보들 추가하는 방식
                        // (이렇게 안하면 추가로 가져온 상품들만 나타남)
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 상품들을 가져오는데 실패 했습니다.")
                }
            })
    }

    const loadMoreHanlder = () => {

        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true  // 더보기 버튼으로 가져온 정보인지 여부
        }

        getProducts(body)
        // 위에서 수정한 skip 업데이트
        setSkip(skip)
    }

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

            {/* Filter */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <Checkbox list={continents} />
                </Col>
            </Row>


            {/* Search */}


            {/* Cards */}

            {/* 카드 간의 간격 */}
            <Row gutter={[16, 16]} >
                {renderCards}
            </Row>

            <br />

            {/* 더 가져올 상품 없을 땐 더보기 버튼 숨기기 */}
            {/* 백엔드에서 가져온 상품개수가 8개 이상이면 더 가져올 정보 있다는 뜻 */}
            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHanlder}>더보기</button>
                </div>
            }


        </div>
    )
}

export default LandingPage
