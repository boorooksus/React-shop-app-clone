import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
// import { Icon } from 'antd';
import axios from 'axios';

function FileUpload(props) {
    // 이미지 저장해두는 state
    // (form태그의 submit 버튼 눌러서 백엔드에 보내기 전에 업로드한 이미지 저장해 둬야함)
    // 이미지 여러장 올릴 수 있도록 array로 저장
    const [Images, setImages] = useState([])

    const dropHandler = (files) => {
        
        // 파일 전송할 때는 이것도 같이 전송해야함.
        let formData = new FormData();  // 파일에 대한 정보들
        const config = {
            // 이게 어떤 파일인지에 대한 content-type을 header에 정의
            // -> 백엔드에서 받을 수 있게 함.
            header: { 'content-type': 'multipart/fomr-data' }
        }
        formData.append("file", files[0])
        // 위의 formdata, config 같이 안보내면 에러 발생함
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    // '...Images': 기존의 Images가 가지고 있던것도 같이 불러옴
                    // (안그러면 새로운 데이터만 들어가고 기존에 올렸던 이미지 데이터 없어짐)
                    // 그리고 새로운 데이터 filePath 넣어서 배열에 데이터 추가시킴.
                    setImages([...Images, response.data.filePath])
                    
                    console.log('imgs: ', Images)

                    props.refreshFunction([...Images, response.data.filePath])

                } else {
                    console.log('res: ', response.data)
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {
        // 클릭한 이미지의 인덱스
        const currentIndex = Images.indexOf(image);
        // 현재 state에 있는 이미지들 배열 복사
        let newImages = [...Images]
        // 배열에서 인덱스 currentIndex에서 부터 1개의 이미지를 지운다.
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        // 바뀐 정보를 부모 컴포넌트(UploadProductPage.js)에 올려줘야함.
        props.refreshFunction(newImages)


    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* react-dropzone npm 설명 홈페이지 내용 복붙 후 수정 */}
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        {/* <Icon type="plus" style={{ fontSize: '3rem' }} /> */}
                        <p>파일을 드래그하세요</p>
                    </div>
                )}
            </Dropzone>

            {/* 업로드한 이미지 보여주는 ui */}
            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

            {Images.map((image, index) => (
                    // 이미지 클릭했을 때 삭제
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default FileUpload
