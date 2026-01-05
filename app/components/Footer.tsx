import { Heart, Mail, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">sebarulang</h3>
                <p className="text-xs text-gray-600">Berbagi Makanan, Berbagi Kasih</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Platform social media untuk berbagi makanan sisa yang masih layak dimakan. 
              Mari bersama kurangi food waste dan bantu sesama yang membutuhkan.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Dampak Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@sebarulang.id" className="hover:text-green-600 transition-colors">
                  hello@sebarulang.id
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="font-bold mb-2 text-sm">Mitra Kami</h5>
              <p className="text-xs text-gray-600">
                Bekerjasama dengan organisasi sosial dan komunitas peduli lingkungan
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 sebarulang. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

