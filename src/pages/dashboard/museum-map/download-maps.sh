#!/bin/bash

# 创建provinces目录
mkdir -p provinces

# 中国省级行政区代码和名称映射
declare -A provinces=(
    ["110000"]="beijing"      # 北京市
    ["120000"]="tianjin"      # 天津市
    ["130000"]="hebei"        # 河北省
    ["140000"]="shanxi"       # 山西省
    ["150000"]="neimenggu"    # 内蒙古自治区
    ["210000"]="liaoning"     # 辽宁省
    ["220000"]="jilin"        # 吉林省
    ["230000"]="heilongjiang" # 黑龙江省
    ["310000"]="shanghai"     # 上海市
    ["320000"]="jiangsu"      # 江苏省
    ["330000"]="zhejiang"     # 浙江省
    ["340000"]="anhui"        # 安徽省
    ["350000"]="fujian"       # 福建省
    ["360000"]="jiangxi"      # 江西省
    ["370000"]="shandong"     # 山东省
    ["410000"]="henan"        # 河南省
    ["420000"]="hubei"        # 湖北省
    ["430000"]="hunan"        # 湖南省
    ["440000"]="guangdong"    # 广东省
    ["450000"]="guangxi"      # 广西壮族自治区
    ["460000"]="hainan"       # 海南省
    ["500000"]="chongqing"    # 重庆市
    ["510000"]="sichuan"      # 四川省
    ["520000"]="guizhou"      # 贵州省
    ["530000"]="yunnan"       # 云南省
    ["540000"]="xizang"       # 西藏自治区
    ["610000"]="shaanxi"      # 陕西省
    ["620000"]="gansu"        # 甘肃省
    ["630000"]="qinghai"      # 青海省
    ["640000"]="ningxia"      # 宁夏回族自治区
    ["650000"]="xinjiang"     # 新疆维吾尔自治区
    ["710000"]="taiwan"       # 台湾省
    ["810000"]="hongkong"     # 香港特别行政区
    ["820000"]="macao"        # 澳门特别行政区
)

echo "开始下载省份地图数据..."

# 下载所有省份地图
for code in "${!provinces[@]}"; do
    name="${provinces[$code]}"
    echo "正在下载: $name ($code)"
    
    # 下载地图数据
    curl -s -o "provinces/${name}.json" "https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json"
    
    # 检查下载是否成功
    if [ -f "provinces/${name}.json" ] && [ -s "provinces/${name}.json" ]; then
        echo "✓ 下载成功: $name"
    else
        echo "✗ 下载失败: $name"
    fi
    
    # 添加小延迟避免请求过快
    sleep 0.5
done

echo "所有省份地图数据下载完成！"
echo "文件保存在 provinces/ 目录下"
