-- Insert demo users
INSERT INTO users (username, password_hash, user_type, full_name, email) VALUES
('admin', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'admin', 'Administrator', 'admin@mediasite.com'),
('user', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'user', 'Regular User', 'user@mediasite.com')
ON CONFLICT (username) DO NOTHING;

-- Insert sample press releases
INSERT INTO press_releases (title, excerpt, content, category, published_date) VALUES
('Konferensi Pers Menteri Lingkungan Hidup', 'Pembahasan kebijakan baru tentang pengelolaan sampah plastik di Indonesia.', 'Menteri Lingkungan Hidup mengumumkan kebijakan baru untuk mengurangi penggunaan plastik sekali pakai...', 'Lingkungan', '2024-01-15'),
('Peluncuran Program Digitalisasi UMKM', 'Pemerintah meluncurkan program bantuan digitalisasi untuk UMKM se-Indonesia.', 'Program digitalisasi UMKM akan membantu usaha kecil dan menengah untuk go digital...', 'Ekonomi', '2024-01-14'),
('Update Situasi Cuaca Ekstrem', 'BMKG memberikan update terkini mengenai kondisi cuaca ekstrem di beberapa wilayah.', 'Badan Meteorologi memberikan peringatan dini terkait cuaca ekstrem...', 'Cuaca', '2024-01-13')
ON CONFLICT DO NOTHING;

-- Insert sample weather data
INSERT INTO weather_data (location, temperature, condition, humidity, wind_speed, pressure, forecast_date) VALUES
('Jakarta', 28, 'Cerah berawan', 65, 12, 1013, CURRENT_DATE),
('Bandung', 24, 'Berawan', 70, 8, 1015, CURRENT_DATE),
('Surabaya', 30, 'Cerah', 60, 15, 1012, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert sample early warnings
INSERT INTO early_warnings (title, description, warning_level, image_url, is_active) VALUES
('Peringatan Cuaca Ekstrem', 'Potensi hujan lebat di wilayah Jabodetabek', 'Sedang', '/placeholder.svg?height=200&width=300', true),
('Peringatan Banjir', 'Waspada banjir di daerah hilir sungai', 'Tinggi', '/placeholder.svg?height=200&width=300', true),
('Peringatan Angin Kencang', 'Angin kencang berpotensi terjadi sore hari', 'Rendah', '/placeholder.svg?height=200&width=300', true)
ON CONFLICT DO NOTHING;

-- Insert sample interview requests
INSERT INTO interview_requests (interviewer_name, media_name, topic, interview_method, interview_datetime, status) VALUES
('John Doe', 'Metro TV', 'Kebijakan Ekonomi Terbaru', 'virtual', '2024-01-15 10:00:00+07', 'completed'),
('Jane Smith', 'Kompas TV', 'Update Cuaca Ekstrem', 'phone', '2024-01-14 14:30:00+07', 'completed'),
('Ahmad Rahman', 'CNN Indonesia', 'Program Digitalisasi UMKM', 'inperson', '2024-01-13 09:15:00+07', 'completed'),
('Sarah Wilson', 'BBC Indonesia', 'Isu Lingkungan Hidup', 'whatsapp', '2024-01-12 16:00:00+07', 'pending'),
('Michael Chen', 'TVRI', 'Perkembangan Teknologi AI', 'virtual', '2024-01-11 11:30:00+07', 'completed')
ON CONFLICT DO NOTHING;
