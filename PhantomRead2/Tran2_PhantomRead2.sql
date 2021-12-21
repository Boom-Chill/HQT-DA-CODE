--Tình huống 7: Phantom Read
--T2: Đối tác xoá sản phẩm có mã 'SP113' của chi nhánh ‘CN105’.
exec sp_phantomread2_t2 'CN105', 'SP113'