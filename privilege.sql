USE DBMS_PA_TH
GO
-- DOI TAC
-- them tai khoan doi tac login_doitac
EXEC sp_addLogin 'login_doitac','login_doitac'

-- them user_doitac cho login_doitac
CREATE USER user_doitac FOR LOGIN  login_doitac

-- them role doi_tac
EXEC sp_addrole 'doitac'

EXEC sp_addrolemember 'doitac',user_doitac 

-- Doi tac them - xoa - sua thong tin san pham
GRANT SELECT, INSERT, DELETE, UPDATE 
ON OBJECT::SANPHAM 
TO doitac

-- Doi tac them - xoa - sua thong tin chi nhanh
GRANT SELECT, INSERT, DELETE, UPDATE 
ON OBJECT::CHINHANH 
TO doitac

-- Xem thong tin don hang
GRANT SELECT
ON OBJECT::DONHANG
to doitac

GRANT SELECT
ON OBJECT::CHITIETDH
TO doitac

-- Cap nhap tinh hinh don hang
GRANT UPDATE
ON OBJECT::DONHANG(TinhTrangDH)
TO doitac



-- KHACH HANG
USE DBMS_PA_TH
GO
EXEC sp_addLogin	,'login_khachhang'

-- them user_khachhang cho login_khachhang account
CREATE USER user_khachhang FOR LOGIN  login_khachhang

-- them role customer
EXEC sp_addrole 'khachhang'

EXEC sp_addrolemember 'khachhang',user_khachhang 
-- Xem danh sach doi tac
GRANT SELECT
ON OBJECT::DOITAC
TO khachhang

-- Xem thong tin don hang
GRANT SELECT
ON OBJECT::DONHANG(TINHTRANGDH)
TO khachhang

GRANT SELECT
ON OBJECT::DONHANG(DONHANGID)
TO khachhang

GRANT SELECT
ON OBJECT::SANPHAM
TO khachhang

-- TAI XE
USE DBMS_PA_TH
GO
-- them tai khoan login_taixe
EXEC sp_addLogin 'login_taixe','login_taixe'

-- them user_taixe cho tai khoan login_taixe
CREATE USER user_taixe FOR LOGIN  login_taixe

-- them role tai_xe
EXEC sp_addrole 'taixe'

EXEC sp_addrolemember 'taixe',user_taixe

-- Chon don hang
GRANT SELECT 
ON OBJECT::DONHANG	
TO taixe

GRANT SELECT
ON OBJECT::CHITIETDH
TO taixe

-- cap nhat tinh trang don hang
GRANT UPDATE
ON OBJECT::DONHANG(TINHTRANGDH)
TO taixe

-- NHAN VIEN
-- them tai khoan login_nhanvien
EXEC sp_addLogin 'login_nhanvien','login_nhanvien'

-- them user_nhanvien cho login_nhanvien 
CREATE USER user_nhanvien FOR LOGIN  login_nhanvien

-- them role nhan_vien
EXEC sp_addrole 'nhanvien'

EXEC sp_addrolemember 'nhanvien',user_nhanvien 

-- Xem danh sach hop dong cua doi tac
GRANT SELECT
ON OBJECT::HOPDONG
TO nhanvien

-- Cap nhat thoi gian hieu luc
GRANT UPDATE
ON OBJECT::HOPDONG(NGAYDK, NGAYKT)
TO nhanvien

-- ADMIN

USE DBMS_PA_TH
GO
EXEC sp_addLogin 'login_admin','login_admin'

-- them user_khachhang cho login_khachhang account
CREATE USER user_admin FOR LOGIN  login_admin

-- them role customer
EXEC sp_addrole 'admin0'

EXEC sp_addrolemember 'admin0', user_admin
-- Cap nhat thong tin tai khoan
GRANT UPDATE
ON OBJECT::NGUOIDUNG
TO admin0
-- Them xoa sua tai khoan nhan vien
GRANT SELECT, INSERT, DELETE, UPDATE
ON OBJECT::NHANVIEN
TO admin0
-- Them xoa sua tai khoan quan ly
GRANT SELECT, INSERT, DELETE, UPDATE
ON OBJECT::QUANTRI
TO admin0
-- Kich hoat hoac khoa tai khoan
GRANT UPDATE
ON OBJECT::NGUOIDUNG(USERSTATUS)
TO admin0

-- CAP QUYEN THAO TAC TREN DU LIEU 
-- Ung 3 nguoi trong nhom se co 1 account admin
USE master
exec sp_addLogin 'login_admin1','login_admin1'
exec sp_addLogin 'login_admin2','login_admin2'
exec sp_addLogin 'login_admin3','login_admin3'
GO
-- Tao 3 user account cho 3 admin
USE DBMS_PA_TH
CREATE USER user_dbadmin1 FOR LOGIN login_dbadmin1
CREATE USER user_dbadmin2 FOR LOGIN login_dbadmin2
CREATE USER user_dbadmin3 FOR LOGIN login_dbadmin3
-- them role db_datawriter cho 3 admin
exec sp_addrolemember 'db_owner','user_admin1'
exec sp_addrolemember 'db_owner','user_admin2'
exec sp_addrolemember 'db_owner','user_admin3'
GO