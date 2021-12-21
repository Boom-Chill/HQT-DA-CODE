const sql = require('mssql/msnodesqlv8')
const express = require('express')
const app = express()
const cors = require('cors')
const generateID = require('./utils/ganerateId.js')

//config db
const mssql = new sql.ConnectionPool({
  database: 'DBMS_PA_TH',
  server: 'localhost',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
})

const PORT = 5001

mssql.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`server run at ${PORT}`)
  })
 })

//middleware
app.use(express.urlencoded({ extended: true, limit: '50000mb' }))
app.use(express.json({limit: '50000mb' }))
app.use(cors())

app.post('/api/auth/login', async (req, res) => {
  const userReq = req.body
  try {
    const userRes = await mssql.request().query(
      `
      select ND.USERID, ND.USERNAME, ND.LOAI, ND.USERSTATUS, ND.HOTEN from NGUOIDUNG ND
      where ND.USERNAME = '${userReq.USERNAME}' and ND.USERPASSWORD = '${userReq.USERPASSWORD}' 
      `
    )

    const user = userRes.recordsets[0][0]
    
    if( !user) {
      return res.send({
        error: true,
        message: 'Sai tên người dùng hoặc mật khẩu'
      })
    }

    const userType = user.LOAI

    let userInfo = {}
    if(userType == 'DT') {
      userInfo = await mssql.request().query(
        `
        select * from DOITAC DT
        where DT.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'TX') {
      userInfo = await mssql.request().query(
        `
        select * from TAIXE TX
        where TX.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'AD') {
      userInfo = await mssql.request().query(
        `
        select * from QUANTRI QT
        where QT.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'NV') {
      userInfo = await mssql.request().query(
        `
        select * from NHANVIEN NV
        where NV.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'KH') {
      userInfo = await mssql.request().query(
        `
        select * from KHACHHANG KH
        where KH.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    }


    if(user?.USERSTATUS ) {
      res.send({
        error: false,
        data:  {
          id: user.USERID,
          name: user.HOTEN,
          username: user.USERNAME,
          type: user.LOAI,
          info: userInfo,
        }
      })
    } else {
      res.send({
        error: true,
        message: 'Tài khoản đang bị khoá'
      })
    }

  
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/products', async (req, res) => {
  try {
      const products = await mssql.request().query(
      `
      select SP.TENSP, SP.GIA, SP.SANPHAMID, DT.DOITACID, DT.THANHPHO, DT.QUAN ,DT.LOAIHANG, DT.DIACHIKD, DT.DAIDIEN  from SANPHAM SP
      join CUNGCAP CC on CC.SANPHAMID = SP.SANPHAMID
      join CHINHANH CN on CN.CHINHANHID = CC.CHINHANHID
      join DOITAC DT on DT.DOITACID = CN.DOITACID
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/partner/orders', async (req, res) => {
  const partnerID = req.query.id
  try {
      const invoices = await mssql.request().query(
      `
      select DH.DONHANGID, DH.HINHTHUCTT, DH.DIACHIGH, DH.PHIVC, DH.TINHTRANGDH, ND.HOTEN from DONHANG DH
      join KHACHHANG KH on KH.KHACHHANGID = DH.NGUOIMUAID
      join NGUOIDUNG ND on ND.USERID = KH.USERID
      join DOITAC DT on DH.NGUOIBANID = DT.DOITACID and DT.DOITACID = '${partnerID}'
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/admin', async (req, res) => {
  const partnerID = req.query.id
  try {
      const products = await mssql.request().query(
      `
      select SP.TENSP, SP.GIA, SP.SANPHAMID, DT.DOITACID, DT.THANHPHO, DT.QUAN ,DT.LOAIHANG, DT.DIACHIKD, DT.DAIDIEN  from SANPHAM SP
      join CUNGCAP CC on CC.SANPHAMID = SP.SANPHAMID
      join CHINHANH CN on CN.CHINHANHID = CC.CHINHANHID
      join DOITAC DT on DT.DOITACID = CN.DOITACID and DT.DOITACID = '${partnerID}'
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/driver', async (req, res) => {
  const driverID = req.query.id
  try {
      const invoices = await mssql.request().query(
      `
      select DH.DONHANGID, DH.HINHTHUCTT, DH.DIACHIGH, DH.PHIVC, DH.TINHTRANGDH, ND.HOTEN from DONHANG DH
      join KHACHHANG KH on KH.KHACHHANGID = DH.NGUOIMUAID
      join NGUOIDUNG ND on ND.USERID = KH.USERID
      join TAIXE TX on TX.TAIXEID = DH.TAIXEID and TX.TAIXEID = '${driverID}'
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/contracts', async (req, res) => {
  try {
      const contracts = await mssql.request().query(
      `
      select * from HOPDONG
      `
    )
    res.send(contracts.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/users', async (req, res) => {
  try {
      const users = await mssql.request().query(
      `
      select * from NGUOIDUNG
      `
    )
    res.send(users.recordsets[0])
  } catch (error) {
    console.log(error)
  }
  
})

app.get('/api/partner-branch', async (req, res) => {
  const partnerID = req.query.id
  try {
      const branchs = await mssql.request().query(
      `
      select CN.CHINHANHID from CHINHANH CN
      join DOITAC DT on DT.DOITACID = CN.DOITACID and DT.DOITACID = '${partnerID}'
      `
    )
    res.send(branchs.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})















//TRANS 1
app.get('/api/test1-reset', async (req, res) => {
  try {
    const response = await mssql.request().query(
      `
      exec sp_lostupdate_t1 @DonHangID = 'DH101', @TinhTrang = N'Chờ tài xế xác nhận' 
      `
    )

    res.send(response.recordset[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test1-driver', async (req, res) => {
  const id = req.query.id
  const status = req.query.status
  try {
    const response = await mssql.request().query(
      `
      exec sp_lostupdate_t2 @DonHangID = '${id}', @TinhTrang = N'${status}' 
      `
    )

    res.send(response.recordset[0])

  
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test1-partner', async (req, res) => {
  const id = req.query.id
  const status = req.query.status
  try {
    const response = await mssql.request().query(
      `
      exec sp_lostupdate_t1 @DonHangID = '${id}', @TinhTrang = N'${status}'  
      `
    )

    res.send(response.recordset[0])

  
  } catch (error) {
    console.log(error)
  }
})

//---------------FIX-TRANS-1
app.get('/api/test1-driver-fix', async (req, res) => {
  const id = req.query.id
  const status = req.query.status
  try {
    const response = await mssql.request().query(
      `
      exec sp_lostupdate_t2_fix @DonHangID = '${id}', @TinhTrang = N'${status}' 
      `
    )
    console.log("🚀 ~ file: index.js ~ line 65 ~ app.post ~ res", response)

    res.send(response.recordset[0])

  
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test1-partner-fix', async (req, res) => {
  const id = req.query.id
  const status = req.query.status
  try {
    const response = await mssql.request().query(
      `
      exec sp_lostupdate_t1_fix @DonHangID = '${id}', @TinhTrang = N'${status}'  
      `
    )
    console.log("🚀 ~ file: index.js ~ line 65 ~ app.post ~ res", response)

    res.send(response.recordset[0])

  
  } catch (error) {
    console.log(error)
  }
})




//TRANS 2
app.get('/api/branchs', async (req, res) => {
  try {
      const branchs = await mssql.request().query(
      `
      select CN.CHINHANHID from CHINHANH CN
      `
    )
    res.send(branchs.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/test2-partner', async (req, res) => {
  const data = req.body
  const productID = `\'SP${generateID.generateID(3, 3)}\'`
  try {
    const response = await mssql.request().query(
      `
      exec sp_dirtyread1_t1 
      @SanPhamID = ${productID}, @TenSP = N'${data.TENSP}', @Gia = ${data.GIA}, @ChiNhanhID = '${data.CHINHANHID}'
      `
    )

    res.send(response.recordset[0])
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})

app.get('/api/test2-customer', async (req, res) => {
  const branchID = req.query.id
  try {
    const response = await mssql.request().query(
      `
      exec sp_dirtyread1_t2
      @ChiNhanhID = ${branchID}
      `
    )

    res.send(response.recordset)

  
  } catch (error) {
    console.log(error)
  }
})

//---------------FIX-TRANS-2
app.post('/api/test2-partner-fix', async (req, res) => {
  const data = req.body
  const productID = `\'SP${generateID.generateID(3, 3)}\'`
  try {
    const response = await mssql.request().query(
      `
      exec sp_dirtyread1_t1_fix 
      @SanPhamID = ${productID}, @TenSP = N'${data.TENSP}', @Gia = ${data.GIA}, @ChiNhanhID = '${data.CHINHANHID}'
      `
    )

    res.send(response.recordset[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test2-customer-fix', async (req, res) => {
  const branchID = req.query.id
  try {
    const response = await mssql.request().query(
      `
      exec sp_dirtyread1_t2_fix
      @ChiNhanhID = ${branchID}
      `
    )

    res.send(response.recordset)

  
  } catch (error) {
    console.log(error)
  }
})






//TRANS-3
app.get('/api/products/:id', async (req, res) => {
  const productID = req.query.id
  try {
    const product = await mssql.request().query(
      `
      select * from SANPHAM SP where SP.SANPHAMID = '${productID}'
      `
    )

    res.send(product.recordsets[0])  
  } catch (error) {
    console.log(error)
  }
})

app.patch('/api/test3-partner/:id', async (req, res) => {
  const productID = req.params.id
  const price = Number(req.body.GIA)
  try {
    const product = await mssql.request().query(
      `
      exec sp_dirtyread2_t1 @masp = '${productID}', @gia = ${price}
      `
    )

    res.send(product.recordsets[0])  
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})







//TRANS 4
app.post('/api/test4-login', async (req, res) => {
  console.log('test 4')
  const data = req.body
  try {
    const userRes = await mssql.request().query(
      `
      exec sp_unrepeatableread1_t1 
      @TaiKhoan = '${data.USERNAME}', @MatKhau = '${data.USERPASSWORD}'
      `
    )
    console.log("🚀 ~ file: index.js ~ line 368 ~ app.post ~ userRes", userRes)

    const user = userRes.recordsets[0][0]
    
    if( !user) {
      return res.send({
        error: true,
        message: 'Sai tên người dùng hoặc mật khẩu'
      })
    }

    const userType = user.LOAI

    let userInfo = {}
    if(userType == 'DT') {
      userInfo = await mssql.request().query(
        `
        select * from DOITAC DT
        where DT.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'TX') {
      userInfo = await mssql.request().query(
        `
        select * from TAIXE TX
        where TX.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'AD') {
      userInfo = await mssql.request().query(
        `
        select * from QUANTRI QT
        where QT.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'NV') {
      userInfo = await mssql.request().query(
        `
        select * from NHANVIEN NV
        where NV.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'KH') {
      userInfo = await mssql.request().query(
        `
        select * from KHACHHANG KH
        where KH.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    }


    if(user?.USERSTATUS ) {
      res.send({
        error: false,
        data:  {
          id: user.USERID,
          name: user.HOTEN,
          username: user.USERNAME,
          type: user.LOAI,
          info: userInfo,
        }
      })
    } else {
      res.send({
        error: true,
        message: 'Tài khoản đang bị khoá'
      })
    }

  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})

app.post('/api/test4-admin', async (req, res) => {
  const data = req.body
  try {
    const response = await mssql.request().query(
      `
      exec sp_unrepeatableread1_t2
      @TaiKhoan = '${data.USERNAME}', @MatKhauMoi = '${data.USERPASSWORD}'
      `
    )

    const users = await mssql.request().query(
      `
      select * from NGUOIDUNG
      `
    )

    res.send(users.recordsets[0])

  
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})

//-------FIX-TRANS 4
app.post('/api/test4-login-fix', async (req, res) => {
  console.log('test 4')
  const data = req.body
  try {
    const userRes = await mssql.request().query(
      `
      sp_unrepeatableread1_t1_fix
      @TaiKhoan = '${data.USERNAME}', @MatKhau = '${data.USERPASSWORD}'
      `
    )

    const user = userRes.recordsets[0][0]
    
    if( !user) {
      return res.send({
        error: true,
        message: 'Sai tên người dùng hoặc mật khẩu'
      })
    }

    const userType = user.LOAI

    let userInfo = {}
    if(userType == 'DT') {
      userInfo = await mssql.request().query(
        `
        select * from DOITAC DT
        where DT.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'TX') {
      userInfo = await mssql.request().query(
        `
        select * from TAIXE TX
        where TX.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'AD') {
      userInfo = await mssql.request().query(
        `
        select * from QUANTRI QT
        where QT.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'NV') {
      userInfo = await mssql.request().query(
        `
        select * from NHANVIEN NV
        where NV.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    } 
    else if ( userType == 'KH') {
      userInfo = await mssql.request().query(
        `
        select * from KHACHHANG KH
        where KH.USERID = '${user.USERID}' 
        `
      )
      userInfo = userInfo.recordsets[0][0]
    }


    if(user?.USERSTATUS ) {
      res.send({
        error: false,
        data:  {
          id: user.USERID,
          name: user.HOTEN,
          username: user.USERNAME,
          type: user.LOAI,
          info: userInfo,
        }
      })
    } else {
      res.send({
        error: true,
        message: 'Tài khoản đang bị khoá'
      })
    }

  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})






//TRANS 5
app.patch('/api/test5-partner', async (req, res) => {
  const data = req.body
  try {
      const partners = await mssql.request().query(
      `
      exec sp_unrepeatableread2_t2 @madt = '${data.id}', @lh = '${data.type}', @tp = '${data.city}' 
      `
      )
      const response = await mssql.request().query(
        `
        select * from DOITAC DT where DT.DOITACID = '${data.id}' 
        `
      )
    res.send(response.recordsets[0][0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test5-search', async (req, res) => {
  const data = req.query
  try {
      const partners = await mssql.request().query(
      `
      exec sp_unrepeatableread2_t1 @lh = '${data.type}', @tp = '${data.city}' 
      `
    )
    res.send(partners.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test5-search-fix', async (req, res) => {
  const data = req.query
  try {
      const partners = await mssql.request().query(
      `
      exec sp_unrepeatableread2_t1_fix @lh = '${data.type}', @tp = '${data.city}' 
      `
    )
    res.send(partners.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})





//TRANS 6
app.get('/api/partners', async (req, res) => {
  try {
      const partners = await mssql.request().query(
      `
      select DT.DOITACID from DOITAC DT
      `
    )
    res.send(partners.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/partners/:id', async (req, res) => {
  const id = req.params.id
  
  try {
      const partners = await mssql.request().query(
      `
      select * from DOITAC DT where DT.DOITACID = '${id}'
      `
    )
    res.send(partners.recordsets[0][0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test6-staff-view', async (req, res) => {
  try {
    const response = await mssql.request().query(
      `
      exec sp_phantomread1_t1
      `
    )

    res.send(response.recordsets[1])

  
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test6-staff-view-fix', async (req, res) => {
  try {
    const response = await mssql.request().query(
      `
      exec sp_phantomread1_t1_fix
      `
    )

    res.send(response.recordsets[1])

  
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/test6-staff-add', async (req, res) => {
  const contractID = `\'HD${generateID.generateID(3, 3)}\'`
  const data = req.body
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
   try {
    const response = await mssql.request().query(
      `
      exec sp_phantomread1_t2
      @HopDongId = ${contractID},
      @DoiTacId = '${data.DOITACID}',
      @Msthue = '${data.MSTHUE}',
      @Daidien = N'${data.DAIDIEN}',
      @Sochinhanh = ${data.SOCHINHANH},
      @Ngaydk = '${date}',
      @Ngaykt = '${date}'
      `
    )

    const partners = await mssql.request().query(
      `
      select * from HOPDONG
      `
    )
    res.send(partners.recordsets[0])

  
  } catch (error) {
    console.log(error)
  }
})



//--TRANS-7 
app.delete('/api/test7-partner-delete/:id', async (req, res) => {
  const partnerID = req.query.id
  const productID = req.params.id
  try {
    const branchID =  await mssql.request().query(
      `
      select CC.CHINHANHID from CUNGCAP CC where CC.SANPHAMID = '${productID}'
      `
    )
    const response = await mssql.request().query(
      `
      exec sp_phantomread2_t2 @sp = '${productID}',  @cn = ${branchID.recordsets[0][0].CHINHANHID}
      `
      )

    const products = await mssql.request().query(
      `
      select SP.TENSP, SP.GIA, SP.SANPHAMID, DT.DOITACID, DT.THANHPHO, DT.QUAN ,DT.LOAIHANG, DT.DIACHIKD, DT.DAIDIEN  from SANPHAM SP
      join CUNGCAP CC on CC.SANPHAMID = SP.SANPHAMID
      join CHINHANH CN on CN.CHINHANHID = CC.CHINHANHID
      join DOITAC DT on DT.DOITACID = CN.DOITACID and DT.DOITACID = '${partnerID}'
      `
    )
    res.send(products.recordsets[0])
  
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test7-customer-view', async (req, res) => {
  console.log('enter')
  const branchID = req.query.id
  try {
    const response = await mssql.request().query(
      `
      exec sp_phantomread2_t1 @cn = '${branchID}'
      `
    )

    res.send(response.recordsets[1])

  
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/test7-customer-view-fix', async (req, res) => {
  console.log('enter')
  const branchID = req.query.id
  try {
    const response = await mssql.request().query(
      `
      exec sp_phantomread2_t1_fix @cn = '${branchID}'
      `
    )

    res.send(response.recordsets[1])

  
  } catch (error) {
    console.log(error)
  }
})