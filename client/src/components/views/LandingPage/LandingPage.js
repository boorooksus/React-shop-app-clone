import React, { useEffect, useState } from 'react'
import axios from "axios";
import {  Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';

function LandingPage() {

    // 상품 정보들을 state에 담아서 활용
    const [Products, setProducts] = useState([])
    // 몽고db의 skip과 limit을 위한 state
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)  // 처음 메인 화면에 상품 8개 가져옴
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

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

    const showFilteredResults = (filters) => {

        let body = {
            // 체크박스 누를 때마다 상품정보 처음부터 가져와야 하기 때문에
            // skip은 0으로 지정
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)

    }

    const handlePrice = (value) => {
        // Datas.js에 들어있는 가격 옵션 목록
        const data = price;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                // 최소가격, 최대 가격 저장된 배열 받아서 저장
                array = data[key].array;
            }
        }
        return array;
    }

    // category: 적용할 필터가 대륙 or Price인지
    // filter: 체크된 값들이 담긴 array
    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        console.log('filters', filters)

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)

    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere  </h2>
            </div>

            {/* Filter */}

            <Row gutter={[16, 16]}>
                {/* 체크박스 사이즈 12(lg)와 라디오 12 합치면 24(xs) */}
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    {/* Checkbox에 props로 list와 handleFilters를 보냄 */}
                    {/* handleFilters는 CheckBox에서 모든 일 처리한 후, 부모 state인 
                    Filters(위에 선언된 useState)로 전달하기 위해서 props로 전달 */}
                    <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row>


            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature
                    refreshFunction={updateSearchTerm}
                />
            </div>

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
