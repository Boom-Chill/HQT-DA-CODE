--Tình huống 7: Phantom Read
-- T1: Khách hàng xem số sản phẩm cũng như danh sách sách phẩm theo mã chi nhánh ‘CN105’.
exec sp_phantomread2_t1 'CN105'