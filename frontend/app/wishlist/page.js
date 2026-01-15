export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist</h1>
        <p className="text-gray-600 mb-8">Save your favorite products for later</p>
        
        <div className="bg-gray-50 rounded-lg p-12">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start adding products you love to your wishlist</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
