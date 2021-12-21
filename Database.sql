create database DBMS_PA_TH
go
use DBMS_PA_TH
go
/*User*/
create table NGUOIDUNG 
(
USERID CHAR(5) NOT NULL,
USERNAME VARCHAR(30),
USERPASSWORD VARCHAR(30),
HOTEN NVARCHAR(50),
LOAI CHAR(2),
USERSTATUS BIT,
EMAIL VARCHAR(30),
PHONE CHAR(10)
CONSTRAINT PK_USER PRIMARY KEY(USERID)
)
GO
/*NhanVien*/
create table NHANVIEN
(
NHANVIENID char(7),
USERID char(5)
constraint PK_NHANVIEN primary key(NHANVIENID)
)
go
/*QuanTri*/
create table QUANTRI
(
QUANTRIID char(7),
USERID char(5)
constraint PK_QUANTRI primary key(QUANTRIID)
)
go
/*KhachHang*/
create table KHACHHANG
(
KHACHHANGID CHAR(7) NOT NULL,
USERID CHAR(5) NOT NULL,
DIACHI NVARCHAR(100)
CONSTRAINT PK_KHACHHANG PRIMARY KEY(KHACHHANGID)
)
GO
/*DoiTac*/
create table DOITAC
(
DOITACID CHAR(7) NOT NULL,
USERID CHAR(5) NOT NULL,
DAIDIEN NVARCHAR(30),
THANHPHO NVARCHAR(30),
QUAN NVARCHAR(30),
SOCHINHANH INT CHECK(SOCHINHANH>=1),
SLDHMN INT CHECK(SLDHMN>=0),
LOAIHANG NVARCHAR(30),
DIACHIKD NVARCHAR(100),
DOANHTHU MONEY CHECK(DOANHTHU>=0),
HOAHONG MONEY
CONSTRAINT PK_DOITAC PRIMARY KEY(DOITACID)
)
GO
/*TaiXe*/

create table TAIXE
(
TAIXEID CHAR(7) NOT NULL,
USERID CHAR(5) NOT NULL,
DIACHI NVARCHAR(100),
CMND VARCHAR(12),
BIENSOXE VARCHAR(9),
KHUVUCHD NVARCHAR(50),
TAIKHOANNH VARCHAR(15),
THUNHAP MONEY CHECK(THUNHAP>=0)
CONSTRAINT PK_TAIXE PRIMARY KEY(TAIXEID)
)
GO
/*HopDong*/
create table HOPDONG
(
HOPDONGID VARCHAR(10) NOT NULL,
DOITACID CHAR(7) NOT NULL,
MSTHUE VARCHAR(20),
DAIDIEN NVARCHAR(30),
SOCHINHANHDK INT CHECK(SOCHINHANHDK>=1),
NGAYDK DATE,
NGAYKT DATE
CONSTRAINT PK_HOPDONG PRIMARY KEY(HOPDONGID)
)
GO
create table CT_HOPDONG
(
HOPDONGID VARCHAR(10) NOT NULL,
CHINHANHID VARCHAR(7) NOT NULL,
CONSTRAINT PK_CT_HOPDONG PRIMARY KEY(HOPDONGID,CHINHANHID)
)
GO
/*ChiNhanh*/
create table CHINHANH	
(
CHINHANHID VARCHAR(7) NOT NULL,
DOITACID CHAR(7) NOT NULL,
DIACHICN NVARCHAR(100),
CONSTRAINT PK_CHINHANH PRIMARY KEY(CHINHANHID)
)
GO
/*DonHang*/
create table DONHANG
(
DONHANGID VARCHAR(10) NOT NULL,
HINHTHUCTT NVARCHAR(30),
NGAYDH DATE ,
DIACHIGH NVARCHAR(100) ,
PHIVC MONEY CHECK (PHIVC>=0),
PHISP MONEY CHECK(PHISP>0),
TONGGIA MONEY ,
TINHTRANGDH NVARCHAR(50) ,
NGUOIMUAID CHAR(7) ,
NGUOIBANID CHAR(7) ,
TAIXEID CHAR(7) 
CONSTRAINT PK_DONHANG PRIMARY KEY(DONHANGID)
)
GO
/*ChiTietDonHang*/
create table CHITIETDH
(
DONHANGID VARCHAR(10) NOT NULL,
SANPHAMID VARCHAR(10) ,
SOLUONG INT CHECK(SOLUONG>=1),
GIABAN MONEY CHECK(GIABAN>=0),
CONSTRAINT PK_CHITIETDH PRIMARY KEY(DONHANGID,SANPHAMID)
)
GO
/*SanPham*/
create table SANPHAM
(
SANPHAMID VARCHAR(10) NOT NULL,
TENSP NVARCHAR(30),
GIA MONEY CHECK (GIA>=0),
CONSTRAINT PK_SANPHAM PRIMARY KEY(SANPHAMID)
)
GO
create table CUNGCAP
(
CHINHANHID VARCHAR(7) NOT NULL,
SANPHAMID VARCHAR(10) NOT NULL,
CONSTRAINT PK_CUNGCAP PRIMARY KEY(CHINHANHID, SANPHAMID)
)
/*ForeignKey*/
alter table DOITAC
add constraint FK_DOITAC_USER foreign key (USERID)
references NGUOIDUNG (USERID)
alter table TAIXE
add constraint FK_TAIXE_USER foreign key (USERID)
references NGUOIDUNG (USERID)
alter table KHACHHANG
add constraint FK_KHACHHANG_USER foreign key (USERID)
references NGUOIDUNG (USERID)
alter table DONHANG
add constraint FK_DONHANG_KHACHHANG foreign key (NGUOIMUAID)
references KHACHHANG (KHACHHANGID)
alter table DONHANG
add constraint FK_DONHANG_DOITAC foreign key (NGUOIBANID)
references DOITAC(DOITACID)
alter table DONHANG
add constraint FK_DONHANG_TAIXE foreign key (TAIXEID)
references TAIXE (TAIXEID)
alter table CHITIETDH 
add constraint FK_DONHANG_CHITIETDH foreign key (DONHANGID)
references DONHANG (DONHANGID)
alter table CHITIETDH
add constraint FK_CHITIETDH_SANPHAM foreign key (SANPHAMID)
references SANPHAM (SANPHAMID)
alter table HOPDONG 
add constraint FK_HOPDONG_DOITAC foreign key (DOITACID)
references DOITAC (DOITACID)
alter table CT_HOPDONG 
add constraint FK_HOPDONG_CT_HOPDONG foreign key (HOPDONGID)
references HOPDONG(HOPDONGID)
alter table CT_HOPDONG 
add constraint FK_CHINHANH_CT_HOPDONG foreign key (CHINHANHID)
references CHINHANH(CHINHANHID)
alter table CUNGCAP
add constraint FK_CHINHANH_CUNGCAP foreign key (CHINHANHID)
references CHINHANH(CHINHANHID)
alter table CUNGCAP
add constraint FK_SANPHAM_CUNGCAP foreign key (SANPHAMID)
references SANPHAM(SANPHAMID)
alter table CHINHANH
add constraint FK_CHINHANH_DOITAC foreign key(DOITACID)
references DOITAC(DOITACID)
alter table NHANVIEN
add constraint FK_NHANVIEN_NGUOIDUNG foreign key(USERID)
references NGUOIDUNG(USERID)
alter table QUANTRI
add constraint FK_QUANTRI_NGUOIDUNG foreign key(USERID)
references NGUOIDUNG(USERID)
/*Function*/
create function fn_PhiSP(@MaDH varchar(10))
returns money
begin 
	return (Select SUM(GIABAN*SOLUONG) from CHITIETDH where CHITIETDH.DONHANGID=@MaDH)
end
go
use DBMS_PA_TH
go
/*Insert Data*/
insert into NGUOIDUNG values
('1001','tuongduy','duy380',N'Phan Tường Duy','KH',1,'duy380@gmail.com','0868059405'),
('1002','phuongnam','nam480',N'Nguyễn Ngọc Phương Nam','DT',1,'nam480@gmail.com','0868584939'),
('1003','phuqui','qui647',N'Nguyễn Phú Quí','TX',1,'qui647@gmail.com','0805904023'),
('1004','dinhkhoa','khoa123',N'Lâm Đình Khoa','KH',1,'khoa123@gmail.com','0684495204'),
('1005','cghung','hung456',N'Bùi Công Hưng','TX',1,'hung456@gmail.com','0545423145'),
('1006','nghung','hung678',N'Lê Ngọc Hùng','DT',1,'lnh678@gmail.com','0594423145'),
('1007','minh','minhlc123',N'Lê Công Minh','AD',1,'lcm@gmail.com','0694020302'),
('1008','duc','huynhdc',N'Lê Huỳnh Đức','NV',1,'lhd@gmail.com','0123584920')
go
insert into NHANVIEN values
('NV1001','1008')
go
insert into QUANTRI values
('AD1001','1007')
go
insert into KHACHHANG values
('KH1001','1001',N'Quận 10, TP.HCM'),
('KH1002','1004',N'Quận 3, TP.HCM')
go
insert into DOITAC values
('DT1001','1002',N'Phương',N'TP.HCM',N'Quận 3',3,25,N'Thực phẩm',N'485 Võ Văn Tần, Quận 3',null,null),
('DT1002','1006',N'Linh',N'TP.HCM',N'Quận 10',2,25,N'May mặc',N'123/2 Võ CMT8, Quận 10',null,null)
go
insert into TAIXE values
('TX1001','1003',N'123 Nguyễn Trãi, Quận 1, TP.HCM','314585929','61D423234',N'Quận 3, TP.HCM','5151516161',null),
('TX1002','1005',N'367 CMT8, Quận 10, TP.HCM','314583123','29X356431',N'Quận 10,TP.HCM','591958199',null)
go
insert into CHINHANH values
('CN101','DT1001',N'12 Trần Phú, Quận 1, TP.HCM'),
('CN102','DT1001',N'72 Phan Đình Phùng, Quận Phú Nhuận, TP.HCM'),
('CN103','DT1001',N'818 3/2, Quận 10, TP.HCM'),
('CN104','DT1002',N'48 Nguyễn Thị Minh Khai, Quận 1, TP.HCM'),
('CN105','DT1002',N'12 Trần Phú, Quận 1, TP.HCM')
go
insert into HOPDONG values
('HD101','DT1001','1000591591','Phương',2,'2021-12-08','2022-12-08'),
('HD102','DT1002','1000591472','Linh',2,'2021-03-11','2022-03-11')
go
insert into CT_HOPDONG values
('HD101','CN101'),
('HD101','CN103'),
('HD102','CN104'),
('HD102','CN105')
go
insert into SANPHAM values
('SP101',N'Gạo',100000),
('SP102',N'Nước suối',8000),
('SP103',N'Nước tăng lực',15000),
('SP104',N'Pepsi',14000),
('SP105',N'Mirinda cam',12000),
('SP106',N'Cơm gà',45000),
('SP107',N'Xúc xích',18000),
('SP108',N'Cơm nắm',17000),
('SP109',N'Sữa tươi',20000),
('SP110',N'Nước trái cây',16000),
('SP111',N'Áo sơ mi',115000),
('SP112',N'Quần Jeans',300000),
('SP113',N'Quần đùi',45000),
('SP114',N'Áo thun',70000),
('SP115',N'Áo khoác',250000)
go
insert into CUNGCAP values
('CN101','SP101'),
('CN101','SP103'),
('CN101','SP108'),
('CN101','SP105'),
('CN101','SP106'),
('CN103','SP101'),
('CN103','SP102'),
('CN103','SP103'),
('CN103','SP104'),
('CN103','SP107'),
('CN103','SP109'),
('CN103','SP110'),
('CN104','SP111'),
('CN104','SP112'),
('CN105','SP112'),
('CN105','SP113'),
('CN105','SP114'),
('CN105','SP115')
go
insert into DONHANG values
('DH101',N'Tiền mặt','2021-12-05',N'40 Tô Hiến Thành, Quận 10, TP.HCM',25000,null,null,N'Đang giao','KH1001','DT1001','TX1002'),
('DH102',N'Tiền mặt','2021-11-03',N'40 Tô Hiến Thành, Quận 10, TP.HCM',22000,null,null,N'Đã giao','KH1001','DT1001','TX1002'),
('DH103',N'Tiền mặt','2021-10-25',N'12 Võ Văn Tần, Quận 3, TP.HCM',27000,null,null,N'Đã giao','KH1002','DT1002','TX1001'),
('DH104',N'Tiền mặt','2021-11-28',N'12 Võ Văn Tần, Quận 3, TP.HCM',25000,null,null,N'Đã giao','KH1002','DT1001','TX1001')
go
insert into CHITIETDH values
('DH101','SP101',1,100000),
('DH101','SP105',1,12000),
('DH101','SP109',2,20000),
('DH102','SP102',10,8000),
('DH102','SP110',6,16000),
('DH103','SP111',1,115000),
('DH103','SP112',1,280000),
('DH104','SP106',1,45000),
('DH103','SP104',2,12000) 
go
/*Update Data*/
use  DBMS_PA_TH
go
update DONHANG
set PHISP=dbo.fn_PhiSP(DONHANG.DONHANGID) from CHITIETDH

update DONHANG
set TONGIGA=PHISP+PHIVC
