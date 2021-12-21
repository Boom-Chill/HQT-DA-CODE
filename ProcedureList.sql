----------------------------------------------------XÁC ĐỊNH TÌNH HUỐNG TRANH CHẤP-----------------------------------------------------------------------
--LOST UPDATE:
--LostUpdate T1:
create proc sp_lostupdate_t1
@TinhTrang nvarchar(50),
@DonHangID varchar(10)
as 
begin tran
			if IS_ROLEMEMBER('doitac')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else 
				if exists(select * from DONHANG where DONHANGID=@DonHangID)
					begin
							update DONHANG
							set TINHTRANGDH=@TinhTrang where DONHANGID=@DonHangID
							select TINHTRANGDH
							from DONHANG where DONHANGID=@DonHangID
					end
commit tran
grant exec on sp_lostupdate_t1
to doitac
go
--LostUpdate T2:
create proc sp_lostupdate_t2
@TinhTrang nvarchar(50),
@DonHangID varchar(10)
as 
begin tran
			if IS_ROLEMEMBER('taixe')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else 
				if exists(select * from DONHANG where DONHANGID=@DonHangID)
					begin
							waitfor delay '00:00:05'
							update DONHANG
							set TINHTRANGDH=@TinhTrang where DONHANGID=@DonHangID
							select TINHTRANGDH
							from DONHANG where DONHANGID=@DonHangID
					end
commit tran
grant exec on sp_lostupdate_t1
to taixe
go
--DIRTYREAD:
--TRƯỜNG HỢP 1:
--DirtyRead1 T1: 
create proc sp_dirtyread1_t1
@SanPhamID varchar(10),
@TenSP nvarchar(30),
@Gia money,
@ChiNhanhID varchar(7)
as
begin tran
			if IS_ROLEMEMBER('doitac')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
				if not exists(select* from SANPHAM where SANPHAMID=@SanPhamID)
					begin
							insert into SANPHAM
							values(@SanPhamID,@TenSP,@Gia)
							insert into CUNGCAP
							values(@ChiNhanhID,@SanPhamID)
							waitfor delay '00:00:05'
						if (select GIA from SANPHAM where SANPHAMID=@SanPhamID)=0
							begin
								rollback tran
							end
						select * from SANPHAM join CUNGCAP on SANPHAM.SANPHAMID=CUNGCAP.SANPHAMID and CUNGCAP.CHINHANHID=@ChiNhanhID
					end
grant exec on sp_dirtyread1_t1
to doitac
go
--DirtyRead1 T2:
create proc sp_dirtyread1_t2
@ChiNhanhID varchar(7)
as
begin tran
set transaction isolation level read uncommitted
			if IS_ROLEMEMBER('khachhang')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
				if exists(select *from CHINHANH where CHINHANHID=@ChiNhanhID)
					begin
						select * from SANPHAM join CUNGCAP on SANPHAM.SANPHAMID=CUNGCAP.SANPHAMID and CUNGCAP.CHINHANHID=@ChiNhanhID
					end
commit tran
grant exec on sp_dirtyread1_t2
to khachhang
go
--TRƯỜNG HỢP 2:
--DirtyRead2 T1: 
Create procedure sp_dirtyread2_t1 @masp varchar(10), @gia money
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('doitac') = 0 AND IS_ROLEMEMBER('db_owner') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS (SELECT * FROM SANPHAM sp where sp.SANPHAMID = @masp)
				BEGIN
					SELECT * FROM SANPHAM sp where sp.SANPHAMID = @masp 
					UPDATE SANPHAM SET GIA = @gia WHERE SANPHAMID = @masp
					WAITFOR DELAY '00:00:05'
					IF((SELECT GIA FROM SANPHAM WHERE SANPHAMID = @masp) = 0)
						BEGIN
							ROLLBACK TRANSACTION
						END
				END
GO
GRANT EXEC ON sp_dirtyread2_t1
TO doitac
go
--DirtyRead2 T2: 
Create procedure sp_dirtyread2_t2 @masp varchar(10)
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('doitac') = 0 AND IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('khachhang') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS (SELECT * FROM SANPHAM sp where sp.SANPHAMID = @masp)
				BEGIN
					SELECT * FROM SANPHAM sp where sp.SANPHAMID = @masp
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_dirtyread2_t2
TO doitac
GO
GRANT EXEC ON sp_dirtyread2_t2
TO khachhang
GO
--UNREPEATABLE READ:
--TRƯỜNG HỢP 1:
--UnrepeatableRead1 T1: 
create proc sp_unrepeatableread1_t1
@TaiKhoan varchar(30),
@MatKhau varchar(30)
as
begin tran
if(not exists (select * from NGUOIDUNG where USERNAME=@TaiKhoan))
begin
PRINT N'SAI USERNAME' RETURN
end
if(not exists (select * from NGUOIDUNG where USERNAME=@TaiKhoan and NGUOIDUNG.USERPASSWORD=@MatKhau))
begin
PRINT N'SAI PASSWORD' RETURN
end
PRINT N'DANG NHAP THANH CONG'
waitfor delay '00:00:05'
select * from NGUOIDUNG where USERNAME=@TaiKhoan and USERPASSWORD=@MatKhau
commit
--UnrepeatableRead1 T2: 
create proc sp_unrepeatableread1_t2
@TaiKhoan varchar(30),
@MatKhauMoi varchar(30)
as
begin tran
if IS_ROLEMEMBER('admin0')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
			begin
					update NGUOIDUNG
					set USERPASSWORD=@MatKhauMoi where USERNAME=@TaiKhoan
			end
commit
grant exec on sp_unrepeatableread1_t2
to admin0
go
--TRƯỜNG HỢP 2:
--UnrepeatableRead2 T1: 
CREATE PROCEDURE sp_unrepeatableread2_t1 @tp nvarchar(30), @lh nvarchar(30)
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('khachhang') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS(SELECT * FROM DOITAC WHERE THANHPHO = @tp AND LOAIHANG = @lh)
				BEGIN
					SELECT * FROM DOITAC WHERE THANHPHO = @tp AND LOAIHANG = @lh
					WAITFOR DELAY '00:00:10'
					SELECT * FROM DOITAC WHERE THANHPHO = @tp AND LOAIHANG = @lh
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_unrepeatableread2_t1
TO khachhang
GO
--UnrepeatableRead2 T2:
CREATE PROCEDURE sp_unrepeatableread2_t2 @madt char(7), @tp nvarchar(30), @lh nvarchar(30)
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('doitac') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS(SELECT * FROM DOITAC WHERE DOITACID = @madt AND THANHPHO = @tp)
				BEGIN
					UPDATE DOITAC SET LOAIHANG = @lh WHERE  THANHPHO = @tp and DOITACID = @madt
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_unrepeatableread2_t2
TO doitac
GO
--PHANTOM READ:
--TRƯỜNG HỢP 1:
--PhantomRead1 T1:
create proc sp_phantomread1_t1
as 
begin tran
if IS_ROLEMEMBER('nhanvien')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
			begin
			select * from HOPDONG
			waitfor delay '00:00:05'
			select*from HOPDONG
			end
commit tran
grant exec on sp_phantomread1_t1
to nhanvien
go
--PhantomRead1 T2:
create proc sp_phantomread1_t2
@HopDongId varchar(10),
@DoiTacId char(7),
@Msthue varchar(20),
@Daidien nvarchar(30),
@Sochinhanh int,
@Ngaydk date,
@Ngaykt date
as
begin tran
if IS_ROLEMEMBER('nhanvien')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
			begin
				if not exists(select * from HOPDONG where HOPDONGID=@HopDongId)
					begin
						insert into HOPDONG 
						values(@HopDongId,@DoiTacId,@Msthue,@Daidien,@Sochinhanh,@Ngaydk,@Ngaykt)
					end
				if (@Ngaydk>@Ngaykt)
					begin
						rollback tran
						return
					end
				end
commit tran
grant exec on sp_phantomread1_t2
to nhanvien
go
--TRƯỜNG HỢP 2:
--PhantomRead2 T1:
CREATE PROCEDURE sp_phantomread2_t1 @cn varchar(7)
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('khachhang') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS(SELECT * FROM CUNGCAP cc WHERE cc.CHINHANHID = @cn)
				BEGIN
					SELECT COUNT(*) FROM CUNGCAP cc WHERE cc.CHINHANHID = @cn
					WAITFOR DELAY '00:00:10'
					SELECT * FROM SANPHAM sp join CUNGCAP cc on sp.SANPHAMID = cc.SANPHAMID WHERE CHINHANHID = @cn
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_phantomread2_t1
TO khachhang
GO
--PhantomRead2 T2:
CREATE PROCEDURE sp_phantomread2_t2 @cn varchar(7), @sp varchar(10)
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('doitac') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS(SELECT * FROM CUNGCAP cc WHERE cc.CHINHANHID = @cn and cc.SANPHAMID = @sp)
				BEGIN
					DELETE FROM CUNGCAP
					WHERE SANPHAMID = @sp and CHINHANHID = @cn
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_phantomread2_t2
TO doitac
GO

----------------------------------------------------GIẢI QUYẾT TÌNH HUỐNG TRANH CHẤP-----------------------------------------------------------------------
--DIRTY READ_FIX
--TRƯỜNG HỢP 1:
--DirtyRead1_fix T1:
create proc sp_dirtyread1_t1_fix
@SanPhamID varchar(10),
@TenSP nvarchar(30),
@Gia money,
@ChiNhanhID varchar(7)
as
begin tran
			if IS_ROLEMEMBER('doitac')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
				if not exists(select* from SANPHAM where SANPHAMID=@SanPhamID)
					begin
							insert into SANPHAM
							values(@SanPhamID,@TenSP,@Gia)
							insert into CUNGCAP
							values(@ChiNhanhID,@SanPhamID)
							waitfor delay '00:00:05'
						if (select GIA from SANPHAM where SANPHAMID=@SanPhamID)=0
							begin
								rollback tran
							end
						select * from SANPHAM join CUNGCAP on SANPHAM.SANPHAMID=CUNGCAP.SANPHAMID and CUNGCAP.CHINHANHID=@ChiNhanhID
					end
grant exec on sp_dirtyread1_t1_fix
to doitac
go
--DirtyRead1_fix T2:
create proc sp_dirtyread1_t2_fix
@ChiNhanhID varchar(7)
as
set transaction isolation level read committed
begin tran
			if IS_ROLEMEMBER('khachhang')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
				if exists(select *from CHINHANH where CHINHANHID=@ChiNhanhID)
					begin
						select * from SANPHAM join CUNGCAP on SANPHAM.SANPHAMID=CUNGCAP.SANPHAMID and CUNGCAP.CHINHANHID=@ChiNhanhID
					end
commit tran
grant exec on sp_dirtyread1_t2_fix
to khachhang
go
--TRƯỜNG HỢP 2:
--DirtyRead2_fix T2:
 Create procedure sp_dirtyread2_t2_fix @masp varchar(10)
AS
BEGIN TRAN
		IF IS_ROLEMEMBER('doitac') = 0 AND IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('khachhang') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS (SELECT * FROM SANPHAM sp where sp.SANPHAMID = @masp)
				BEGIN
					SET TRANSACTION ISOLATION LEVEL READ COMMITTED
					SELECT * FROM SANPHAM sp where sp.SANPHAMID = @masp
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_dirtyread2_t2_fix
TO doitac
GO
GRANT EXEC ON sp_dirtyread2_t2_fix
TO khachhang
--UNREPEATABLE READ_FIX:
--TRƯỜNG HỢP 1:
--UnrepeatableRead1_fix T1: 
create proc sp_unrepeatableread1_t1_fix
@TaiKhoan varchar(30),
@MatKhau varchar(30)
as
set transaction isolation level repeatable read
begin tran
if(not exists (select * from NGUOIDUNG where USERNAME=@TaiKhoan))
begin
PRINT N'SAI USERNAME' RETURN
end
if(not exists (select * from NGUOIDUNG where USERNAME=@TaiKhoan and NGUOIDUNG.USERPASSWORD=@MatKhau))
begin
PRINT N'SAI PASSWORD' RETURN
end
PRINT N'DANG NHAP THANH CONG'
waitfor delay '00:00:05'
select * from NGUOIDUNG where USERNAME=@TaiKhoan and USERPASSWORD=@MatKhau
commit
--UnrepeatableRead1_fix T2: Quản trị viên đổi mật khẩu của người dùng 
create proc sp_unrepeatableread1_t2_fix
@TaiKhoan varchar(30),
@MatKhauMoi varchar(30)
as
begin tran
if IS_ROLEMEMBER('admin0')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
			begin
					update NGUOIDUNG
					set USERPASSWORD=@MatKhauMoi where USERNAME=@TaiKhoan
			end
commit
grant exec on sp_unrepeatableread1_t2_fix
to admin0
go
--TRƯỜNG HỢP 2:
--UnrepeatableRead2_fix T1:
CREATE PROCEDURE sp_unrepeatableread2_t1_fix @tp nvarchar(30), @lh nvarchar(30)
AS
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ
BEGIN TRAN
		IF IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('khachhang') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS(SELECT * FROM DOITAC WHERE THANHPHO = @tp AND LOAIHANG = @lh)
				BEGIN
					SELECT * FROM DOITAC WHERE THANHPHO = @tp AND LOAIHANG = @lh
					WAITFOR DELAY '00:00:10'
					SELECT * FROM DOITAC WHERE THANHPHO = @tp AND LOAIHANG = @lh
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_unrepeatableread2_t1_fix
TO khachhang
GO
--PHANTOMREAD:
--TRƯỜNG HỢP 1:
--PhantomRead1_fix T1: 
create proc sp_phantomread1_t1_fix
as 
set transaction isolation level serializable
begin tran
if IS_ROLEMEMBER('nhanvien')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
			begin
			select * from HOPDONG
			waitfor delay '00:00:05'
			select*from HOPDONG
			end
commit tran
grant exec on sp_phantomread1_t1_fix
to nhanvien
go
--PhantomRead1_fix T2:
create proc sp_phantomread1_t2_fix
@HopDongId varchar(10),
@DoiTacId char(7),
@Msthue varchar(20),
@Daidien nvarchar(30),
@Sochinhanh int,
@Ngaydk date,
@Ngaykt date
as
begin tran
if IS_ROLEMEMBER('nhanvien')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else
			begin
				if not exists(select * from HOPDONG where HOPDONGID=@HopDongId)
					begin
						insert into HOPDONG 
						values(@HopDongId,@DoiTacId,@Msthue,@Daidien,@Sochinhanh,@Ngaydk,@Ngaykt)
					end
				if (@Ngaydk>@Ngaykt)
					begin
						rollback tran
						return
					end
				end
commit tran
grant exec on sp_phantomread1_t2_fix
to nhanvien
go
--TRƯỜNG HỢP 2:
--Phantomread2_fix T1:
CREATE PROCEDURE sp_phantomread2_t1_fix @cn varchar(7)
AS
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
BEGIN TRAN
		IF IS_ROLEMEMBER('db_owner') = 0 AND IS_ROLEMEMBER('khachhang') = 0
			BEGIN 
				ROLLBACK TRAN
			END
		ELSE
			IF EXISTS(SELECT * FROM CUNGCAP cc WHERE cc.CHINHANHID = @cn)
				BEGIN
					SELECT COUNT(*) FROM CUNGCAP cc WHERE cc.CHINHANHID = @cn
					WAITFOR DELAY '00:00:10'
					SELECT * FROM SANPHAM sp join CUNGCAP cc on sp.SANPHAMID = cc.SANPHAMID WHERE CHINHANHID = @cn
				END
COMMIT TRAN
GO
GRANT EXEC ON sp_phantomread2_t1_fix
TO khachhang
GO
--LOST UPDATE:
--LostUpdate_fix T1: 
create proc sp_lostupdate_t1_fix
@TinhTrang nvarchar(50),
@DonHangID varchar(10)
as 
set transaction isolation level repeatable read
begin tran
			if IS_ROLEMEMBER('doitac')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else 
				if exists(select * from DONHANG where DONHANGID=@DonHangID)
					begin
							update DONHANG
							set TINHTRANGDH=@TinhTrang where DONHANGID=@DonHangID
							select TINHTRANGDH
							from DONHANG where DONHANGID=@DonHangID
					end
commit tran
grant exec on sp_lostupdate_t1_fix
to doitac
go
--LostUpdate_fix T2: 
create proc sp_lostupdate_t2_fix
@TinhTrang nvarchar(50),
@DonHangID varchar(10)
as 
set transaction isolation level repeatable read
begin tran
			if IS_ROLEMEMBER('taixe')=0 and IS_ROLEMEMBER('db_owner')=0
				begin
					rollback tran
				end
			else 
				if exists(select * from DONHANG where DONHANGID=@DonHangID)
					begin
							waitfor delay '00:00:05'
							update DONHANG
							set TINHTRANGDH=@TinhTrang where DONHANGID=@DonHangID
							select TINHTRANGDH
							from DONHANG where DONHANGID=@DonHangID
					end
commit tran
grant exec on sp_lostupdate_t2_fix
to taixe
go

