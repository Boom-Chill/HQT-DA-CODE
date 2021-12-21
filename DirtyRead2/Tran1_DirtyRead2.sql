--T1: Đối tác cập nhật giá bán sản phẩm có mã sản phẩm là ‘SP101’ nếu giá bán <= 0 thì rollback
--T2: Khách hàng xem thông tin sản phẩm có mã sản phẩm là ‘SP101’
-- Dirty read
--Tran 1:
exec sp_dirtyread2_t1 'SP101', 0

