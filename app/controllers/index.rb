get '/' do
  # @bingocell = Bingocell.all
  # content_type :json
  # @bingocell.to_json
  erb :index

end

get '/test' do
  @bingocell = Bingocell.all
  content_type :json
  @bingocell.to_json
end