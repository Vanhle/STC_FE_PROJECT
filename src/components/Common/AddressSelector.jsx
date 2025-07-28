/*
Component này cung cấp một form 3 bước để người dùng chọn và nhập địa chỉ tại Hà Nội, bao gồm:

Chọn quận/huyện

Chọn phường/xã

Nhập địa chỉ cụ thể (số nhà, tên đường, tòa nhà...)

Khi đầy đủ 3 trường, component sẽ tự động ghép và trả về địa chỉ đầy đủ thông qua prop onChange.
*/

import React, { useState, useEffect, useRef, useCallback } from "react";
import districtData from "../../data/district.json";

const AddressSelector = ({
  value = "",
  onChange,
  error = "",
  label = "Address",
  icon = "bi bi-geo-alt",
  required = false,
  disabled = false,
}) => {
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  // Track when we're parsing from external value to prevent onChange calls
  const isParsingRef = useRef(false);

  // Ward data for common wards in Hanoi
  const wardsByDistrict = {
    "Bắc Từ Liêm": [
      "Cổ Nhuế 1",
      "Cổ Nhuế 2",
      "Đức Thắng",
      "Liên Mạc",
      "Phú Diễn",
      "Thượng Cát",
      "Xuân Đỉnh",
      "Tây Tựu",
      "Minh Khai",
    ],
    "Cầu Giấy": [
      "Dịch Vọng",
      "Dịch Vọng Hậu",
      "Mai Dịch",
      "Nghĩa Đô",
      "Quan Hoa",
      "Trung Hòa",
      "Yên Hòa",
      "Nghĩa Tân",
    ],
    "Hai Bà Trưng": [
      "Bách Khoa",
      "Đống Mác",
      "Ngô Thì Nhậm",
      "Phạm Đình Hổ",
      "Quỳnh Lôi",
      "Quỳnh Mai",
      "Thanh Lương",
      "Thanh Nhàn",
      "Trương Định",
      "Vĩnh Tuy",
    ],
    "Hoàng Mai": [
      "Đại Kim",
      "Định Công",
      "Giáp Bát",
      "Hoàng Liệt",
      "Hoàng Văn Thụ",
      "Lĩnh Nam",
      "Mai Động",
      "Tân Mai",
      "Thanh Trì",
      "Thịnh Liệt",
    ],
    "Hà Đông": [
      "Biên Giang",
      "Dương Nội",
      "Hà Cầu",
      "La Khê",
      "Mộ Lao",
      "Nguyễn Trãi",
      "Phú La",
      "Phú Lãm",
      "Quang Trung",
      "Văn Quán",
      "Yên Nghĩa",
    ],
    "Long Biên": [
      "Bồ Đề",
      "Gia Thụy",
      "Ngọc Lâm",
      "Ngọc Thụy",
      "Phúc Đồng",
      "Phúc Lợi",
      "Sài Đồng",
      "Thạch Bàn",
      "Thượng Thanh",
      "Việt Hưng",
    ],
    "Nam Từ Liêm": [
      "Cầu Diễn",
      "Mễ Trì",
      "Mỹ Đình 1",
      "Mỹ Đình 2",
      "Phú Đô",
      "Phương Canh",
      "Tây Mỗ",
      "Trung Văn",
      "Xuân Phương",
    ],
    "Thanh Xuân": [
      "Hạ Đình",
      "Khương Đình",
      "Khương Mai",
      "Khương Trung",
      "Kim Giang",
      "Nhân Chính",
      "Phương Liệt",
      "Thanh Xuân Bắc",
      "Thanh Xuân Nam",
      "Thanh Xuân Trung",
    ],
    "Tây Hồ": [
      "Bưởi",
      "Nhật Tân",
      "Phú Thượng",
      "Quảng An",
      "Thụy Khuê",
      "Tứ Liên",
      "Xuân La",
      "Yên Phụ",
    ],
  };

  // Common address examples for datalist
  const addressExamples = [
    "43 Đường Phạm Văn Đồng",
    "15 Ngõ 123 Xuân Thủy",
    "Số 8 Trần Duy Hưng",
    "25A Nguyễn Trãi",
    "Tòa nhà Epic Home",
    "Chung cư Goldmark City",
    "123 Láng Hạ",
    "456 Kim Mã",
    "789 Hoàng Quốc Việt",
    "101 Nguyễn Chí Thanh",
  ];

  // Build and call onChange when fields change (but not during parsing)
  const buildAndNotifyAddress = useCallback(() => {
    if (isParsingRef.current) return; // Don't call onChange while parsing

    if (specificAddress && ward && district) {
      const fullAddress = `${specificAddress}, P. ${ward}, Q. ${district}, TP. Hà Nội`;
      if (onChange && fullAddress !== value) {
        onChange(fullAddress);
      }
    } else if (!specificAddress && !ward && !district) {
      if (onChange && value !== "") {
        onChange("");
      }
    }
  }, [specificAddress, ward, district, onChange, value]);

  // Parse existing value when component mounts or value changes
  useEffect(() => {
    isParsingRef.current = true; // Set flag to prevent onChange calls

    if (value) {
      const addressParts = value.split(", ");
      if (addressParts.length >= 4) {
        // Parse "43 Đường Phạm Văn Đồng, P. Cổ Nhuế 2, Q. Bắc Từ Liêm, TP. Hà Nội"
        const specificPart = addressParts[0]; // "43 Đường Phạm Văn Đồng"
        const wardPart = addressParts[1]; // "P. Cổ Nhuế 2"
        const districtPart = addressParts[2]; // "Q. Bắc Từ Liêm"

        // Set specific address
        setSpecificAddress(specificPart);

        // Extract ward
        if (wardPart.startsWith("P. ")) {
          setWard(wardPart.substring(3));
        }

        // Extract district
        if (districtPart.startsWith("Q. ")) {
          setDistrict(districtPart.substring(3));
        }
      }
    } else {
      // Reset all fields when value is empty
      setSpecificAddress("");
      setWard("");
      setDistrict("");
    }

    // Clear flag after parsing is done
    setTimeout(() => {
      isParsingRef.current = false;
    }, 0);
  }, [value]);

  // Build address when any field changes (after parsing is done)
  useEffect(() => {
    buildAndNotifyAddress();
  }, [buildAndNotifyAddress]);

  const availableWards = district ? wardsByDistrict[district] || [] : [];

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold">
          {icon && <i className={`${icon} me-2`}></i>}
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {/* Step 1: District Selection */}
      <div className="mb-3">
        <select
          className={`form-select ${error ? "is-invalid" : ""}`}
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setWard(""); // Reset ward when district changes
          }}
          disabled={disabled}
        >
          <option value="">Select district</option>
          {districtData.map((districtName, index) => (
            <option key={index} value={districtName}>
              Q. {districtName}
            </option>
          ))}
        </select>
        <small className="text-muted">Select a district first</small>
        {error && !district && (
          <div className="text-danger small mt-1">
            <i className="bi bi-exclamation-circle me-1"></i>
            Please select a district
          </div>
        )}
      </div>

      {/* Step 2: Ward Selection - Only show when district is selected */}
      {district && (
        <div className="mb-3">
          <select
            className={`form-select ${error ? "is-invalid" : ""}`}
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select ward</option>
            {availableWards.map((wardName, index) => (
              <option key={index} value={wardName}>
                P. {wardName}
              </option>
            ))}
          </select>
          <small className="text-muted">Select a ward in {district}</small>
          {error && !ward && (
            <div className="text-danger small mt-1">
              <i className="bi bi-exclamation-circle me-1"></i>
              Please select a ward
            </div>
          )}
        </div>
      )}

      {/* Step 3: Specific Address - Only show when ward is selected */}
      {ward && (
        <div className="mb-3">
          <div className="position-relative">
            <input
              type="text"
              className={`form-control ${error ? "is-invalid" : ""}`}
              placeholder="Enter specific address (house number, street, building...)"
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
              list="address-suggestions"
              disabled={disabled}
            />
            <datalist id="address-suggestions">
              {addressExamples.map((example, index) => (
                <option key={index} value={example} />
              ))}
            </datalist>
          </div>
          <small className="text-muted">
            Enter specific address (house number, street, building...)
          </small>
          {error && !specificAddress && (
            <div className="text-danger small mt-1">
              <i className="bi bi-exclamation-circle me-1"></i>
              Please enter a specific address
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {(specificAddress || ward || district) && (
        <div className="mt-2 p-3 bg-light rounded border-start border-primary border-4">
          <small className="text-muted fw-semibold">
            <i className="bi bi-eye me-1"></i>
            Address preview:
          </small>
          <div className="text-primary fw-medium fs-6 mt-1">
            {specificAddress && specificAddress}
            {specificAddress && (ward || district) && ", "}
            {ward && `P. ${ward}`}
            {ward && district && ", "}
            {district && `Q. ${district}`}
            {(specificAddress || ward || district) && ", TP. Hà Nội"}
          </div>
          {specificAddress && ward && district && (
            <small className="text-success">
              <i className="bi bi-check-circle me-1"></i>
              Address complete
            </small>
          )}
        </div>
      )}

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default AddressSelector;
