import { Heart, Mail, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden md:block bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">sebarulang</h3>
                <p className="text-xs text-gray-600">Berbagi Makanan, Berbagi Kasih</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Platform social media untuk berbagi makanan sisa yang masih layak dimakan. 
              Mari bersama kurangi food waste dan bantu sesama yang membutuhkan.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors block py-1">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors block py-1">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors block py-1">
                  Dampak Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors block py-1">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Hubungi Kami</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <a href="mailto:hello@sebarulang.id" className="hover:text-green-600 transition-colors break-all">
                  hello@sebarulang.id
                </a>
              </li>
            </ul>
            <div className="mt-4 sm:mt-6">
              <h5 className="font-bold mb-2 text-xs sm:text-sm">Mitra Kami</h5>
              <p className="text-xs text-gray-600">
                Bekerjasama dengan organisasi sosial dan komunitas peduli lingkungan
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center md:text-left">
            © 2026 sebarulang. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors min-h-[44px] flex items-center">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors min-h-[44px] flex items-center">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

