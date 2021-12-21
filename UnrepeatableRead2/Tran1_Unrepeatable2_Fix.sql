--Tình huống 5:
--T1: Khách hàng tìm kiếm nhà cung cấp theo thành phố "TP.HCM" và loại hàng vận chuyển 'May mặc'
--T2: Đối tác 'DT1002' thay đổi loại hàng mà họ vận chuyển thành 'Giày da'
--Unrepeatable Read 2
exec sp_unrepeatableread2_t1_fix N'TP.HCM', N'May mặc'